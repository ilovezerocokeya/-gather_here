"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

type UploadType = "profile" | "background";


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

  if (updateError) {
    console.error("[updateUserImage] DB 업데이트 실패:", updateError.message);
    throw new Error(`DB 업데이트 실패: ${updateError.message}`);
  }

  console.log(`[updateUserImage] DB 업데이트 완료: ${column} →`, publicUrl);
}