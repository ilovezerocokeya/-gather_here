import { fetchPostsWithDeadLine } from "@/lib/fetchPosts";
import StudiesClientContent from "./StudiesClientContnet";


const StudiesServerContent = async () => {
  const posts = await fetchPostsWithDeadLine(14, "스터디"); // 메인 목록
  const carouselPosts = await fetchPostsWithDeadLine(15, "스터디"); // 캐러셀 목록

  if (!posts || posts.length === 0) {
    return <div>포스트를 불러오는 중 문제가 발생했습니다.</div>;
  }

  return <StudiesClientContent initialPosts={posts} initialCarouselPosts={carouselPosts} />;
};

export default StudiesServerContent;