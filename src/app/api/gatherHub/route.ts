import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const job = searchParams.get("job") ?? "all"; // job 파라미터 추가

    if (page < 1 || limit < 1 || isNaN(page) || isNaN(limit)) {
      console.error("잘못된 페이지네이션 값:", { page, limit });
      return NextResponse.json({ error: "잘못된 페이지네이션 값입니다." }, { status: 400 });
    }

    const offset = (page - 1) * limit;

    // 기본 조건
    let memberQuery = supabase
      .from("Users")
      .select(
        "user_id, nickname, job_title, experience, blog, description, background_image_url, profile_image_url, answer1, answer2, answer3, first_link_type, first_link, second_link_type, second_link, tech_stacks, contact"
      )
      .eq("hubCard", true)
      .order("created_at", { ascending: false });

    let countQuery = supabase
      .from("Users")
      .select("user_id", { count: "exact", head: true })
      .eq("hubCard", true);

    // job 필터링 적용
    if (job !== "all") {
      memberQuery = memberQuery.eq("job_title", job);
      countQuery = countQuery.eq("job_title", job);
    }

    const [{ data: members, error }, { count, error: countError }] = await Promise.all([
      memberQuery.range(offset, offset + limit - 1),
      countQuery,
    ]);

    if (error || countError) {
      console.error("Supabase Query Error:", error ?? countError);
      return NextResponse.json({ error: "멤버 데이터를 불러오는 중 오류 발생" }, { status: 500 });
    }

    return NextResponse.json(
      {
        members,
        totalCount: count ?? 0,
        nextPage: offset + limit < (count ?? 0) ? page + 1 : undefined,
      },
      { status: 200 }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "알 수 없는 서버 오류가 발생했습니다.";
    console.error("Unexpected Server Error:", { error: err, url: req.url });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};