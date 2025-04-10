"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function updateProfileImage(file: File | Blob): Promise<string> {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session!.user.id;
  const filename = `profile_${Buffer.from(userId).toString("base64")}.png`;
  const path = `profileImages/${filename}`;

  // Supabase 스토리지에 이미지 업로드 (덮어쓰기 허용)
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(path, file, { upsert: true });

  if (uploadError) {
    throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
  }

  // 업로드된 파일의 public URL 조회
  const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(path);
  const publicUrl = publicUrlData?.publicUrl;

  if (!publicUrl) {
    throw new Error("공개 URL을 가져오지 못했습니다.");
  }

  // DB에 이미지 URL 반영
  const { error: dbError } = await supabase
    .from("Users")
    .update({ profile_image_url: publicUrl })
    .eq("user_id", userId);

  if (dbError) {
    throw new Error(`DB 업데이트 실패: ${dbError.message}`);
  }

  return publicUrl;
}