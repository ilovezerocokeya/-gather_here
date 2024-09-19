import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormValues } from "@/components/Signup/Signup03";
import { useUser } from "@/provider/UserContextProvider"; 

const supabase = createClient();

const useSubmitProfile = (setUserData: (data: any) => void) => {
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

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        if (session.user.user_metadata?.avatar_url) {
          setProfileImageUrl(session.user.user_metadata.avatar_url);
        }
      }
    };

    fetchUser();
  }, [setUser, setProfileImageUrl]);

  const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === "") {
      return true;
    }

    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,6})" +
        "(:\\d+)?(\\/[-a-z\\d%_.~+\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF@]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i",
    );
    return urlPattern.test(url);
  };

  const onSubmit = async (data: FormValues, nicknameAvailable: boolean | null, setError: any) => {
    const { nickname, blog } = data;

    if (!user?.email) {
      setError("nickname", { message: "유효한 이메일을 확인할 수 없습니다." });
      return;
    }

    if (nicknameAvailable === false) {
      setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
      return;
    }

    let formattedBlog = blog;
    if (blog && !/^https?:\/\//i.test(blog)) {
      formattedBlog = "http://" + blog;
    }

    if (formattedBlog && !validateUrl(formattedBlog)) {
      setBlogError("유효한 URL을 입력하세요.");
      setBlogSuccess(null);
      return;
    }

    setBlogError(null);
    setBlogSuccess("유효한 URL입니다.");

    try {
      const { error: updateError } = await supabase
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
