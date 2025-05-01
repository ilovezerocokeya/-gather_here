"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

type UploadType = "profile" | "background";

// 유저의 이미지 URL을 업데이트하고, 이전 이미지를 Supabase 스토리지에서 삭제하는 서버 액션

export async function updateUserImage(type: UploadType, publicUrl: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  // 인증된 세션 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) throw new Error("로그인 정보가 없습니다.");

  // 어떤 컬럼을 업데이트할지 결정
  const column = type === "profile" ? "profile_image_url" : "background_image_url";

  // 현재 DB에 저장된 기존 이미지 경로 조회
  const { data, error: fetchError } = await supabase
    .from("Users")
    .select(column)
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    throw new Error(`기존 이미지 정보 조회 실패: ${fetchError.message}`);
  }

  const currentUrl: string | null =
  type === "profile"
    ? (data as { profile_image_url: string | null }).profile_image_url
    : (data as { background_image_url: string | null }).background_image_url;

  // 기존 이미지 삭제
  const isDefault =
    !currentUrl ||
    currentUrl.includes("user.svg") || // 프로필 기본 이미지
    currentUrl.includes("welcomeImage.svg"); // 커버 기본 이미지

  if (!isDefault) {
    const segments = currentUrl.split("/").slice(-2);
    const path = segments.join("/");

    const { error: removeError } = await supabase.storage
      .from("images")
      .remove([path]);

    if (removeError) {
      throw new Error(`기존 이미지 삭제 실패: ${removeError.message}`);
    }
  }

  // 새 이미지 URL로 DB 업데이트
  const { error: updateError } = await supabase
    .from("Users")
    .update({ [column]: publicUrl })
    .eq("user_id", userId);

  if (updateError) {
    throw new Error(`DB 업데이트 실패: ${updateError.message}`);
  }
}