import { fetchPostsWithDeadLine } from "@/lib/fetchPosts";
import ProjectClientContent from "./ProjectClientContent";


const ProjectServerContent = async () => {
  const posts = await fetchPostsWithDeadLine(14, "프로젝트");
  const carouselPosts = await fetchPostsWithDeadLine(15, "프로젝트");

  if (!posts || posts.length === 0) {
    return <div>포스트를 불러오는 중 문제가 발생했습니다.</div>;
  }

  return <ProjectClientContent initialPosts={posts} initialCarouselPosts={carouselPosts}  />;
};

export default ProjectServerContent;