"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

type UploadType = "profile" | "background";

// publicUrl에서 key 경로 추출 유틸
const extractStoragePath = (url: string): string => {
  const urlObj = new URL(url);
  const path = urlObj.pathname.split("/").slice(3).join("/"); // ex) public/abcd.webp
  return path;
};


export async function updateUserImage(type: UploadType, publicUrl: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  // 인증된 세션 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) {
    console.error("[updateUserImage] 로그인 정보 없음");
    throw new Error("로그인 정보가 없습니다.");
  }

  const column = type === "profile" ? "profile_image_url" : "background_image_url";

  // DB에서 해당 유저의 이미지 URL을 업데이트
  const { error: updateError } = await supabase
    .from("Users")
    .update({ [column]: publicUrl })
    .eq("user_id", userId);

  // 실패 시 rollback: 업로드된 이미지 삭제
  if (updateError) {
    console.error("[updateUserImage] DB 업데이트 실패:", updateError.message);

    const storagePath = extractStoragePath(publicUrl);
    const { error: removeError } = await supabase.storage
      .from("images") 
      .remove([storagePath]);

    if (removeError) {
      console.error("[updateUserImage] 롤백 실패 (이미지 제거 실패):", removeError.message);
    }

    throw new Error(`DB 업데이트 실패: ${updateError.message}`);
  }

}