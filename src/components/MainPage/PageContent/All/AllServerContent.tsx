import AllClientContent from "@/components/MainPage/PageContent/All/AllClientContent";
import { fetchPosts } from "@/lib/fetchPosts";

const AllServerContent = async () => {
  const initialPosts = await fetchPosts(1);

  // 서버 데이터 없을 경우 방어
  if (!initialPosts || initialPosts.length === 0) {
    return (
      <div className="text-center text-red-500 py-10">
        서버로부터 게시글 데이터를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <AllClientContent initialPosts={initialPosts} />
  );
};

export default AllServerContent;