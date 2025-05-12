import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { exchangeCodeForSession } from "@/utils/supabase/auth";
import { fetchUserData, insertNewUser } from "@/utils/supabase/user";
import { parseError } from "@/utils/supabase/errors";
import type { SupabaseUser } from "@/utils/supabase/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // 인증 코드가 없는 경우 오류 페이지로 리다이렉트
  if (!code) {
    return NextResponse.redirect(new URL("/auth/auth-code-error", url.origin));
  }

  try {
    const supabase = createServerSupabaseClient();

    // 인증 코드를 사용해 Supabase 세션 생성
    const sessionData = await exchangeCodeForSession(supabase, code); 

    // 세션에서 유저 정보 추출 (null 가능성 있음)
    const user: SupabaseUser | null = sessionData?.user ?? null;
    if (!user) {
      return NextResponse.redirect(new URL("/auth/auth-code-error", url.origin));
    }

    // 이미 등록된 유저라면 홈으로 리다이렉트
    const userData = await fetchUserData(supabase, user.id);
    if (userData !== null) {
      return NextResponse.redirect(new URL("/", url.origin));
    }

    // 신규 유저인 경우 DB에 유저 정보 등록
    await insertNewUser(supabase, user);

    // 회원가입 절차 페이지로 이동
    return NextResponse.redirect(new URL("/signup", url.origin));
  } catch (error: unknown) {
    const { message, stack, code: errorCode } = parseError(error);

    console.error("OAuth Callback Error", {
      message,
      stack,
      code: errorCode,
      requestUrl: request.url,
    });

    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
  }
}