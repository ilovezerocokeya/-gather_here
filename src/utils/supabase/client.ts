import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase 환경 변수가 누락되었습니다.");
}

// Supabase 인스턴스를 전역적으로 한 번만 생성
export const supabase: SupabaseClient<Database> = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);