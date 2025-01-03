import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 사용자 데이터 타입
interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

// 세션 교환 함수
const exchangeCodeForSession = async (supabase: any, code: string) => {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw new Error(`세션 교환 실패: ${error.message}`);
  return data;
};

// 사용자 데이터 확인 함수
const fetchUserData = async (supabase: any, userId: string) => {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`사용자 데이터 확인 실패: ${error.message}`);
  return data;
};

// 새 사용자 데이터 삽입 함수
const insertNewUser = async (supabase: any, user: SupabaseUser) => {
  const defaultData = {
    nickname: user.user_metadata?.full_name || user.email.split("@")[0] || "사용자",
    email: user.email,
    profile_image_url: user.user_metadata?.avatar_url || "/logos/hi.png",
    job_title: "",
    hubCard: false,
    background_image_url: "/logos/hi.png",
  };

  const { error } = await supabase.from("Users").insert([defaultData]);
  if (error) throw new Error(`새 사용자 삽입 실패: ${error.message}`);
};

// GET 핸들러
export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    if (!code) throw new Error("URL에서 인증 코드를 찾을 수 없습니다.");

    const supabase = createClient();

    const sessionData = await exchangeCodeForSession(supabase, code);
    const user = sessionData.user;
    const userData = await fetchUserData(supabase, user.id);

    if (userData) {
      return NextResponse.redirect(`${origin}${"/"}`);
    } else {
      await insertNewUser(supabase, user);
      return NextResponse.redirect(`${origin}${"/signup"}`);
    }
  } catch (error: any) {
    console.error("에러 발생:", error.message);
    return NextResponse.redirect("/auth/auth-code-error");
  }
}
