export const revalidate = 60;

import { fetchPosts, fetchPostsWithDeadLine } from "@/lib/fetchPosts";
import ProjectClientContent from "./ProjectClientContent";

const ProjectServerContent = async () => {
  try {
    
    const posts = await fetchPosts(1, "프로젝트"); // 1페이지의 '프로젝트' 게시글 목록을 서버에서 패칭
    const carouselPosts = await fetchPostsWithDeadLine(8, "프로젝트"); // 마감 임박 기준으로 '프로젝트' 게시글 8개 패칭

    // 게시글이 없거나 null일 경우 사용자에게 안내 메시지 출력
    if (!posts || posts.length === 0) {
      console.warn("[ProjectServerContent] ❗ 게시글이 없거나 null입니다.");
      return (
        <div className="text-center text-red-500 py-10">
          포스트를 불러오는 중 문제가 발생했습니다. (데이터 없음)
        </div>
      );
    }

    // 정상적으로 데이터를 받아온 경우, 클라이언트 컴포넌트에 props로 전달
    return (
      <ProjectClientContent 
        initialPosts={posts} 
        initialCarouselPosts={carouselPosts}
      />
    );
  } catch (err) {
    // 서버에서 fetch 도중 오류 발생 시 예외 처리
    console.error("[ProjectServerContent] ❌ 데이터 패칭 중 에러:", err);
    return (
      <div className="text-center text-red-500 py-10">
        포스트를 불러오는 중 문제가 발생했습니다. (에러 발생)
      </div>
    );
  }
};

export default ProjectServerContent;