import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SupabaseUser } from "./types";
import { secureImageUrl } from "@/utils/Image/imageUtils";


// 사용자 데이터 조회 함수 (hydration mismatch 방지)
export async function fetchUserData( 
    supabase: SupabaseClient<Database>, 
    userId: string
) {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
  
      if (error) {
        throw new Error(`사용자 데이터 확인 실패: ${error.message}`);
      }
  
      return data;
    } catch (err) {
      console.error(err);
      throw err;
  }
}

// 새 사용자 데이터 삽입 함수
export async function insertNewUser(
    supabase: SupabaseClient<Database>,
    user: SupabaseUser
) {
    const rowData = {
      user_id: user.id,
      nickname: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "사용자",
      email: user.email ?? null,
      profile_image_url: secureImageUrl(user.user_metadata?.avatar_url ?? null), 
      job_title: null,
      experience: "0",
      description: "안녕하세요! 반갑습니다😆",
      hubCard: false,
      background_image_url: "/logos/defaultBackgroundImage.svg",
      answer1: null,
      answer2: null,
      answer3: null,
      blog: null,
      tech_stacks: [],
    };
  
    try {
      const { error } = await supabase.from("Users").insert([rowData]);
  
      if (error) {
        throw new Error(`새 사용자 삽입 실패: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      throw err; // 예외 발생 시 호출한 곳에서 처리 가능
    }
}