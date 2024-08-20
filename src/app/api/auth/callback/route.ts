import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.user) {
      // 유저 정보 확인
      const user = sessionData.user;
      const { data: userData, error: userFetchError } = await supabase
        .from('Users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userFetchError) {
        console.error('Error fetching user from Users table:', userFetchError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      if (userData) {
        // 이미 유저 정보가 있다면 메인 페이지로 리디렉션
        return NextResponse.redirect(`${origin}/`);
      } else {
        // 기본 유저 정보 삽입
        const nickname = user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자';
        const defaultData = {
          nickname,
          email: user.email,
          blog: "",
          profile_image_url: user.user_metadata?.avatar_url || "",
          experience: "",
          job_title: "",
          user_id: user.id,
        };

        const { error: insertError } = await supabase.from('Users').insert([defaultData]);

        if (insertError) {
          console.error('Error inserting user into Users table:', insertError.message);
          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        }

        // 삽입 성공 후 signup 페이지로 리디렉션
        return NextResponse.redirect(`${origin}/signup`);
      }
    } else {
      console.error('Error exchanging code for session:', error?.message);
      if (error?.message.includes('Database error')) {
        console.error('Database error saving new user:', error.message);
      }
    }
  } else {
    console.warn('No code found in the request URL');
  }

  // 마지막 리디렉션: 기본적으로 /signup으로 리디렉션
  return NextResponse.redirect(`${origin}/signup`);
}