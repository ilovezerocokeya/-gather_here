import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.user) {
      const user = sessionData.user;
      const { data: userData, error: userFetchError } = await supabase
        .from("Users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (userFetchError) {
        console.error("Error fetching user from Users table:", userFetchError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      if (userData) {
        // 이미 사용자 데이터가 있는 경우 메인 페이지로 리다이렉트
        return NextResponse.redirect(`${origin}/`);
      } else {
        // 기본값 설정
        const nickname = user.user_metadata?.full_name || user.email?.split("@")[0] || "사용자";
        const job_title = "";  // job_title은 처음에 빈 문자열로 시작
        const experience = "0";  // 연차 기본값(예: 1년차)
        
        // 연차에 따라 문구를 동적으로 생성
        const experienceText = experience === "0" ? "신입" : `${experience}년 동안`;
        const description = `안녕하세요, ${job_title || '무직'}을 ${experienceText} 하고 있는 ${nickname}입니다.`;

        const defaultData = {
          nickname,
          email: user.email,
          blog: "",
          profile_image_url: user.user_metadata?.avatar_url || "",
          experience,
          job_title: job_title,
          user_id: user.id,
          description,
          hubCard: false,
          background_image_url: "",
        };

        // Users 테이블에 데이터 삽입
        const { error: insertError } = await supabase.from("Users").insert([defaultData]);

        if (insertError) {
          console.error("Error inserting user into Users table:", insertError.message);
          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        }

        // 회원가입 완료 후 리다이렉트
        return NextResponse.redirect(`${origin}/signup`);
      }
    } else {
      console.error("Error exchanging code for session:", error?.message);
      if (error?.message.includes("Database error")) {
        console.error("Database error saving new user:", error.message);
      }
    }
  } else {
    console.warn("No code found in the request URL");
  }

  // 회원가입 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/signup`);
}