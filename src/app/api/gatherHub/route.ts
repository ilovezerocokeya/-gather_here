import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    // Supabase 클라이언트 생성
    const supabase = createServerSupabaseClient();

    // URL에서 page, limit 파라미터 가져오기
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // 잘못된 값이 들어오면 400 에러 반환
    if (page < 1 || limit < 1 || isNaN(page) || isNaN(limit)) {
      console.error("잘못된 페이지네이션 값:", { page, limit });
      return NextResponse.json({ error: "잘못된 페이지네이션 값입니다." }, { status: 400 });
    }

    const offset = (page - 1) * limit;

    // Supabase에서 데이터 가져오기
    const [{ data: members, error }, { count, error: countError }] = await Promise.all([
      supabase
        .from("Users")
        .select(
          "user_id, nickname, job_title, experience, blog, description, background_image_url, profile_image_url, answer1, answer2, answer3, first_link_type, first_link, second_link_type, second_link, tech_stacks"
        )
        .eq("hubCard", true) // hubCard가 true인 유저만 조회
        .order("created_at", { ascending: false }) // 최신 순 정렬
        .range(offset, offset + limit - 1), // 페이지네이션 적용

      supabase
        .from("Users")
        .select("user_id", { count: "exact", head: true })
        .eq("hubCard", true),
    ]);

    // Supabase 에러 처리
    if (error || countError) {
      console.error("Supabase Query Error:", error ?? countError);
      return NextResponse.json({ error: "멤버 데이터를 불러오는 중 오류 발생" }, { status: 500 });
    }

    // 정상 응답 반환
    return NextResponse.json(
      {
        members,
        totalCount: count ?? 0, 
        nextPage: offset + limit < (count ?? 0) ? page + 1 : undefined, // totalCount 활용한 nextPage 계산
      },
      { status: 200 }
    );
  } catch (err) {
    // 예외 처리: 서버 내부 오류 발생 시
    const errorMessage = err instanceof Error ? err.message : "알 수 없는 서버 오류가 발생했습니다.";
    console.error("Unexpected Server Error:", { error: err, url: req.url });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};