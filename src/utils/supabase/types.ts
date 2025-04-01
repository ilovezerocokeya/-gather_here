import type { Database } from "@/types/supabase";
import type { User as SupabaseAuthUser, Session } from "@supabase/supabase-js";

// Supabase 인증된 사용자 타입
export interface SupabaseUser extends Omit<SupabaseAuthUser, "user_metadata"> {
  user_metadata?: {
    full_name?: string;
    avatar_url?: string | null | undefined;
    [key: string]: unknown;
  };
}

// OAuth 로그인 후 세션 교환 시 반환되는 데이터 타입
export interface ExchangeCodeForSessionData {
    user: SupabaseUser;
    session?: Session | null;
    provider_token?: string;
  }


// Users 테이블 관련 타입들
export type SupabaseUserRow = Database["public"]["Tables"]["Users"]["Row"];
export type SupabaseUserInsert = Database["public"]["Tables"]["Users"]["Insert"];
export type SupabaseUserUpdate = Database["public"]["Tables"]["Users"]["Update"];


// Supabase 데이터베이스 스키마 타입
export type { Database } from "@/types/supabase";