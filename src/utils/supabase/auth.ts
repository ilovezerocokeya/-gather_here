import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ExchangeCodeForSessionData } from "./types";

// Supabase OAuth 인증 코드로 세션을 교환하는 함수
export async function exchangeCodeForSession(
  supabase: SupabaseClient<Database>,
  code: string
): Promise<ExchangeCodeForSessionData> {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new Error(`세션 교환 실패: ${error.message}`);
    }

    if (!data) {
      throw new Error("Supabase에서 반환된 데이터가 없습니다.");
    }

    return data as ExchangeCodeForSessionData;
  } catch (err) {
    console.error(err);
    throw err; // 예외 발생 시 호출한 쪽에서 핸들링할 수 있도록 예외를 다시 던짐
  }
}