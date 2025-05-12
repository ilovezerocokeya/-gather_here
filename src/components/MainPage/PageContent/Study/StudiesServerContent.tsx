export const revalidate = 60;

import { fetchPosts, fetchPostsWithDeadLine } from "@/lib/fetchPosts";
import StudiesClientContent from "./StudiesClientContent";

const StudiesServerContent = async () => {
  try {
    
    const posts = await fetchPosts(1, "스터디"); // 1페이지의 '스터디' 게시글 목록을 서버에서 패칭
    const carouselPosts = await fetchPostsWithDeadLine(8, "스터디"); // 마감 임박 기준으로 '스터디' 게시글 8개 패칭

    // 게시글이 없거나 null일 경우 예외 메시지 출력
    if (!posts || posts.length === 0) {
      console.warn("[StudiesServerContent] ❗ 게시글이 없거나 null입니다.");
      return (
        <div className="text-center text-red-500 py-10">
          포스트를 불러오는 중 문제가 발생했습니다. (데이터 없음)
        </div>
      );
    }

    // 정상적으로 데이터를 받아온 경우, 클라이언트 컴포넌트에 props로 전달
    return (
      <StudiesClientContent
        initialPosts={posts} 
        initialCarouselPosts={carouselPosts}
      />
    );
  } catch (err) {
    // 서버에서 데이터 패칭 도중 오류가 발생한 경우 예외 메시지 표시
    console.error("[StudiesServerContent] ❌ 데이터 패칭 중 에러:", err);
    return (
      <div className="text-center text-red-500 py-10">
        포스트를 불러오는 중 문제가 발생했습니다. (에러 발생)
      </div>
    );
  }
};

export default StudiesServerContent;