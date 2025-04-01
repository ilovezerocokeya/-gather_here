import { useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client"; 
import { FormValues } from "@/components/Signup/Signup03";
import { useSignup } from "@/provider/user/UserSignupProvider";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserData } from "@/provider/user/UserDataProvider";
import { defaultUserData, UserData } from "@/types/userData"; 
import type { SupabaseUser } from "@/utils/supabase/types";
import type { UseFormSetError } from "react-hook-form";
import { secureImageUrl } from "@/utils/imageUtils";

// SupabaseUser -> UserData 변환 함수
const mapSupabaseUserToUserData = (supabaseUser: SupabaseUser | null): UserData => ({
  user_id: supabaseUser?.id ?? "",  
  nickname: "",
  job_title: "",
  experience: "", 
  profile_image_url: secureImageUrl(supabaseUser?.user_metadata?.avatar_url ?? ""),
  description: "",
  blog: "", 
});

const useSubmitProfile = (setUserData: React.Dispatch<React.SetStateAction<UserData | null>>) => {
  // 회원가입 단계 관련 상태
  const { nextStep } = useSignup();

  // 사용자 인증 관련 상태
  const { setUser, user } = useAuth();

  // 사용자 프로필 관련 상태 및 업데이트 함수
  const { userData, setUserData: setUserDataState } = useUserData();
  const profileData = userData ?? defaultUserData; // 기본값 설정

  // 프로필 이미지 URL을 설정하는 함수 (불필요한 상태 변경 방지)
  const setProfileImageUrl = useCallback((url: string) => {
    setUserDataState((prev) => ({
      ...prev ?? defaultUserData,
      profile_image_url: secureImageUrl(url),
    }));
  }, [setUserDataState]);

  // 사용자 세션 정보 가져오기 (최적화)
  useEffect(() => {
    let isMounted = true; // 컴포넌트가 언마운트될 경우 방어
  
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
  
      if (isMounted && session?.user) {
        setUser(session.user);
        if (session.user.user_metadata?.avatar_url) {
          setProfileImageUrl(session.user.user_metadata.avatar_url);
        }
      }
    };
  
    fetchUser();
  
    return () => {
      isMounted = false; // 언마운트 시 실행 방지
    };
  }, [setUser, setProfileImageUrl]);

  // 프로필 제출 함수
  const onSubmit = async (
    data: FormValues, 
    nicknameAvailable: boolean, 
    setError: UseFormSetError<FormValues> 
  ) => {
    const { nickname } = data;

    // 유효한 이메일 확인
    if (!user?.email) {
      setError("nickname", { message: "유효한 이메일을 확인할 수 없습니다." });
      return;
    }

    // 닉네임 중복 확인
    if (!nicknameAvailable) {
      setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
      return;
    }

    try {
      // Supabase에서 사용자 데이터 업데이트
      const { data: updatedUser, error: updateError } = await supabase
        .from("Users")
        .update({
          job_title: profileData.job_title,
          experience: String(profileData.experience),
          nickname,
          email: user.email,
          profile_image_url: secureImageUrl(profileData.profile_image_url),
        })
        .eq("user_id", user.id)
        .select()
        .single(); // 업데이트된 데이터 가져오기

      if (updateError) {
        console.error("Error updating data:", updateError);
        setError("nickname", { message: "프로필 업데이트에 실패했습니다. 다시 시도해 주세요." });
        return;
      }

      // setUserData를 `UserData` 형식으로 변환하여 저장
      setUserData((prev) => ({
        ...(prev ?? defaultUserData),
        nickname,
        job_title: profileData.job_title,
        experience: String(profileData.experience),
        profile_image_url: secureImageUrl(profileData.profile_image_url),
        description: prev?.description ?? "",
        blog: prev?.blog ?? "",    
      }));

      nextStep(); // 회원가입 단계 진행
    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      setError("nickname", { message: "예기치 않은 오류가 발생했습니다. 다시 시도해 주세요." });
    }
  };

  return { onSubmit };
};

export default useSubmitProfile;