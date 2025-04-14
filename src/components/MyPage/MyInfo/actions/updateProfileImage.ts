"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function updateProfileImage(publicUrl: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session!.user.id;

  const { error } = await supabase
    .from("Users")
    .update({ profile_image_url: publicUrl })
    .eq("user_id", userId);

  if (error) {
    throw new Error(`DB 업데이트 실패: ${error.message}`);
  }
}