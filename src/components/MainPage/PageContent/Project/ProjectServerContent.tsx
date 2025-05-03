import { fetchPosts, fetchPostsWithDeadLine } from "@/lib/fetchPosts";
import ProjectClientContent from "./ProjectClientContent";

const ProjectServerContent = async () => {
  try {
    const posts = await fetchPosts(1, "프로젝트");
    const carouselPosts = await fetchPostsWithDeadLine(8, "프로젝트");

    if (!posts || posts.length === 0) {
      console.warn("[StudiesServerContent] ❗ 게시글이 없거나 null입니다.");
      return (
        <div className="text-center text-red-500 py-10">
          포스트를 불러오는 중 문제가 발생했습니다. (데이터 없음)
        </div>
      );
    }

    return (
      <ProjectClientContent 
          initialPosts={posts} 
          initialCarouselPosts={carouselPosts} 
      />
    );
  } catch (err) {
    console.error("[StudiesServerContent] ❌ 데이터 패칭 중 에러:", err);
    return (
      <div className="text-center text-red-500 py-10">
        포스트를 불러오는 중 문제가 발생했습니다. (에러 발생)
      </div>
    );
  }
};

export default ProjectServerContent;