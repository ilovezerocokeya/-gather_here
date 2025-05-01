"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface UpdateProfileParams {
  nickname: string;
  jobTitle: string;
  experience: string;
  profileImageUrl: string;
}

export async function updateProfile({
  nickname,
  jobTitle,
  experience,
  profileImageUrl,
}: UpdateProfileParams) {
  const supabase = createServerSupabaseClient();

  // 세션에서 인증된 유저 정보 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  const userId = session!.user.id;

  // 필수값 유효성 검사
  if (!nickname || !jobTitle || !experience) {
    return { error: "닉네임, 직군, 경력은 모두 필수 입력 항목입니다." };
  }

  // 이미지 URL 유효성 검사
  if (profileImageUrl) {
    const urlWithoutQuery = profileImageUrl.split("?")[0];
    const isValidImage = /\.(webp|jpg|jpeg|png)$/i.test(urlWithoutQuery);

    if (!isValidImage) {
      return { error: "프로필 이미지는 jpg, jpeg, png 형식만 허용됩니다." };
    }
  }

  // Supabase DB 업데이트
  const { error: updateError } = await supabase
    .from("Users")
    .update({
      nickname: nickname.trim(),
      job_title: jobTitle,
      experience,
      profile_image_url: profileImageUrl,
    })
    .eq("user_id", userId);

  if (updateError) {
    return { error: "프로필 업데이트에 실패했습니다." };
  }

  // 성공 시 마이페이지로 이동
  redirect("/mypage");
}