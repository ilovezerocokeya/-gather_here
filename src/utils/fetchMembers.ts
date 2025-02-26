import { MemberCardProps } from "@/lib/memberTypes";

// API 응답 데이터 타입 정의
interface FetchMembersResponse {
  members: MemberCardProps[]; // 가져온 멤버 목록
  nextPage?: number; // 다음 페이지 번호
}

// 환경 변수 검증
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("환경 변수 NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

// 멤버 데이터를 서버에서 가져오는 함수
export const fetchMembers = async (pageParam: number = 1): Promise<FetchMembersResponse> => {
  try {
    // 지정된 페이지의 멤버 데이터를 가져옴
    const response = await fetch(`${API_URL}/gatherHub?page=${pageParam}&limit=10`);

    // HTTP 응답이 정상적이지 않을 경우 에러 발생
    if (!response.ok) {
      throw new Error(
        `HTTP 오류 발생! 상태 코드: ${response.status}, URL: ${response.url}`
      );
    }

    // 응답 데이터를 JSON으로 변환
    const data = await response.json();

    // 응답 데이터가 예상한 형식이 아닐 경우 에러 발생
    if (!data.members || !Array.isArray(data.members)) {
      throw new Error(`API 응답 형식 오류: members가 배열이 아님. 응답 데이터: ${JSON.stringify(data)}`);
    }

    // 가져온 데이터와 다음 페이지 정보를 반환
    return {
      members: data.members, // 현재 페이지의 멤버 리스트
      nextPage: data.members.length >= 10 ? pageParam + 1 : undefined, // 다음 페이지 번호 설정
    };
  } catch (error) {
    // 에러 발생 시 콘솔에 출력하고 기본값 반환
    console.error("멤버 데이터를 불러오는 중 오류 발생:", error);
    return { members: [], nextPage: undefined };
  }
};