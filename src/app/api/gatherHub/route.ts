import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Supabase 클라이언트 생성
        const supabase = createServerSupabaseClient();

        // Supabase에서 특정 조건을 만족하는 유저 데이터 조회
        const { data: members, error } = await supabase
            .from("Users")  
            .select("*")
            .eq("hubCard", true);  // hubCard가 true인 유저만 조회

        // 에러 발생 시 500 응답 반환
        if (error) {
            console.error("Supabase Query Error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 정상 응답 반환
        return NextResponse.json({ members }, { status: 200 });

    } catch (err: unknown) {
        // 예외 처리: 서버 내부 오류 발생 시
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 서버 오류가 발생했습니다.";
        console.error("Unexpected Server Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
};