export const revalidate = 60;

import { fetchPosts, fetchPostsWithDeadLine } from "@/lib/fetchPosts";
import StudiesClientContent from "./StudiesClientContent";

const StudiesServerContent = async () => {
  try {
    const posts = await fetchPosts(1, "스터디");
    const carouselPosts = await fetchPostsWithDeadLine(8, "스터디");

    if (!posts || posts.length === 0) {
      console.warn("[StudiesServerContent] ❗ 게시글이 없거나 null입니다.");
      return (
        <div className="text-center text-red-500 py-10">
          포스트를 불러오는 중 문제가 발생했습니다. (데이터 없음)
        </div>
      );
    }

    return (
      <StudiesClientContent
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

export default StudiesServerContent;