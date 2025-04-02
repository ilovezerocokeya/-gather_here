import type { FetchMembersResponse, MemberCardProps } from "@/lib/gatherHub";


// 환경 변수 검증
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;
if (!BASE_URL) {
  throw new Error("환경 변수 NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

// 멤버 데이터를 서버에서 가져오는 함수
export const fetchMembers = async (pageParam = 1): Promise<FetchMembersResponse> => {
  try {
    // 지정된 페이지의 멤버 데이터를 가져옴
    const response = await fetch(`${BASE_URL}/gatherHub?page=${pageParam}&limit=10`, {
      next: { revalidate: 60 }, // 1분마다 캐시 갱신 
    });

    // HTTP 응답이 정상적이지 않을 경우 에러 발생
    if (!response.ok) {
      throw new Error(`HTTP 오류 발생! 상태 코드: ${response.status}, 요청 URL: ${response.url}`);
    }

    // 응답 데이터를 JSON으로 변환
    const data = (await response.json()) as { members: MemberCardProps[] };

    // 응답 데이터 유효성 검사
    if (!Array.isArray(data.members)) {
      console.error("API 응답 오류: members가 배열이 아님", data);
      return { members: [], nextPage: undefined };
    }

    // `nextPage` 계산
    const nextPage = data.members.length === 10 ? pageParam + 1 : undefined;

    return {
      members: data.members,
      nextPage,
    };

  } catch (error) {
    console.error("멤버 데이터를 불러오는 중 오류 발생:", error);
    return { members: [], nextPage: undefined };
  }
};