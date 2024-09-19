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
        return NextResponse.redirect(`${origin}/`);
      } else {
        const nickname = user.user_metadata?.full_name || user.email?.split("@")[0] || "사용자";
        const defaultData = {
          nickname,
          email: user.email,
          blog: "",
          profile_image_url: user.user_metadata?.avatar_url || "",
          experience: "",
          job_title: "",
          user_id: user.id,
        };

        const { error: insertError } = await supabase.from("Users").insert([defaultData]);

        if (insertError) {
          console.error("Error inserting user into Users table:", insertError.message);
          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        }

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

  return NextResponse.redirect(`${origin}/signup`);
}
