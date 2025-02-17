import { createClient } from "@/utils/supabase/server";
import SearchResultCard from "../components/SearchResultCard";

const page = async ({ params }: { params: { keyword: string } }) => {
  const supabase = createClient();
  const keyword = decodeURIComponent(params.keyword);

  let { data, error } = await supabase
    .from("Posts")
    .select("*")
    .or(`title.ilike.${keyword}, content.ilike.%${keyword}%`);

  if (error) return <div>데이터를 불러오는 데 오류가 발생했습니다.</div>;

  return (
    <>
      <div> 검색어:{keyword} </div> <div> Figma 참고해 검색 창 보여주기 </div>
      <div>스터디 / 프로젝트 IT 행사 허브 탭 만들기</div>
      <div>
        {data?.map((post) => (
          <li key={post.post_id}>
            <SearchResultCard post={post} />
          </li>
        ))}
      </div>
    </>
  );
};

export default page;
