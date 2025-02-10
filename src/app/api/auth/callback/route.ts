import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { exchangeCodeForSession } from "@/utils/supabase/auth";
import { fetchUserData, insertNewUser } from "@/utils/supabase/user";
import { parseError } from "@/utils/supabase/errors";
import type { SupabaseUser } from "@/utils/supabase/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/auth-code-error", url.origin));
  }

  try {
    const supabase = createServerSupabaseClient();
    
    // code를 사용해 세션 교환
    const sessionData = await exchangeCodeForSession(supabase, code);

    // SupabaseUser 타입이 아닐 수 있으므로 null 체크
    const user: SupabaseUser | null = sessionData?.user ?? null;
    if (!user) {
      return NextResponse.redirect(new URL("/auth/auth-code-error", url.origin));
    }

    // 유저 데이터가 이미 있다면 리다이렉트
    const userData = await fetchUserData(supabase, user.id);
    if (userData !== null) {
      return NextResponse.redirect(new URL("/", url.origin));
    }

    // 신규 사용자면 DB에 삽입
    await insertNewUser(supabase, user);

    // 회원가입 절차 페이지로 이동
    return NextResponse.redirect(new URL("/signup", url.origin));
  } catch (error: unknown) {
    const { message, stack, code: errorCode } = parseError(error);

    console.error("OAuth Callback Error", {
      message,
      stack,
      code: errorCode,
      requestUrl: request.url, // 요청 URL 포함
    });

    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
  }
}