import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormValues } from "@/components/Signup/Signup03";
import { useUser } from "@/provider/UserContextProvider"; 

const supabase = createClient();

const useSubmitProfile = (setUserData: (data: any) => void) => {   // useUser 훅을 통해 사용자 관련 정보와 상태 업데이트 함수들을 가져옴
  const {
    nextStep,
    setNickname,
    setBlog,
    setUser,
    setProfileImageUrl,
    user,
    job_title,
    experience,
    profile_image_url
  } = useUser();
  
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogSuccess, setBlogSuccess] = useState<string | null>(null);

  // 컴포넌트가 마운트되면 현재 사용자 세션을 가져와 사용자 정보를 설정
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 세션이 있으면 사용자 정보를 설정하고, 아바타 URL이 있으면 프로필 이미지 URL을 설정
      if (session) {
        setUser(session.user);
        if (session.user.user_metadata?.avatar_url) {
          setProfileImageUrl(session.user.user_metadata.avatar_url);
        }
      }
    };

    fetchUser();
  }, [setUser, setProfileImageUrl]);

   //URL의 유효성을 검사하는 함수
  const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === "") {
      return true; // 비어있는 URL은 유효하다고 처리
    }

    // URL 패턴을 정규식으로 검사
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,6})" +
        "(:\\d+)?(\\/[-a-z\\d%_.~+\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF@]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i",
    );
    return urlPattern.test(url); // 유효한 URL이면 true 반환
  };

  //프로필 제출 함수
  const onSubmit = async (data: FormValues, nicknameAvailable: boolean | null, setError: any) => {
    const { nickname, blog } = data;

    // 사용자 이메일이 없으면 에러 처리
    if (!user?.email) {
      setError("nickname", { message: "유효한 이메일을 확인할 수 없습니다." });
      return;
    }

    // 닉네임이 중복되면 에러 처리
    if (nicknameAvailable === false) {
      setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
      return;
    }

    // 블로그 URL이 입력되었고 http 또는 https가 없으면 자동으로 http:// 추가
    let formattedBlog = blog;
    if (blog && !/^https?:\/\//i.test(blog)) {
      formattedBlog = "http://" + blog;
    }

    // 블로그 URL이 유효하지 않으면 에러 처리
    if (formattedBlog && !validateUrl(formattedBlog)) {
      setBlogError("유효한 URL을 입력하세요.");
      setBlogSuccess(null);
      return;
    }

    // 에러 상태 초기화 후 성공 메시지 설정
    setBlogError(null);
    setBlogSuccess("유효한 URL입니다.");

    try {
      const { error: updateError } = await supabase // Supabase에서 Users 테이블을 업데이트하여 프로필 정보를 저장
        .from("Users")
        .update({
          job_title,
          experience,
          nickname,
          blog: formattedBlog,
          email: user.email,
          profile_image_url,
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating data:", updateError);
        setError("nickname", { message: "프로필 업데이트에 실패했습니다. 다시 시도해 주세요." });
        return;
      }

      // 성공적으로 업데이트되면 상태 업데이트
      setNickname(nickname);
      setBlog(formattedBlog || "");
      setUserData({ ...user, nickname, blog: formattedBlog, job_title, experience, profile_image_url });

      nextStep();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("nickname", { message: "예기치 않은 오류가 발생했습니다. 다시 시도해 주세요." });
    }
  };

  return { onSubmit, blogError, blogSuccess, setBlogError, setBlogSuccess, validateUrl };
};

export default useSubmitProfile;
