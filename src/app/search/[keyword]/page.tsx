import { createServerSupabaseClient } from '@/utils/supabase/server';
import SearchResultCard from '../components/SearchResultCard';

const page = async ({ params }: { params: { keyword: string } }) => {
  const supabase = createServerSupabaseClient();
  const keyword = decodeURIComponent(params.keyword);

  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .or(`title.ilike.${keyword}, content.ilike.%${keyword}%`);

  // NOTE: Next.js 의 error.js 사용해봐도 좋을듯
  if (error) return <div>데이터를 불러오는 데 오류가 발생했습니다. 다시 시도해 보세요.</div>;

  return (
    <div className="flex flex-col justify-between items-center">
      <div>스터디 / 프로젝트 IT 행사 허브 탭 만들기</div>
      <div>
        {data?.length ? (
          data?.map((post) => (
            <li key={post.post_id}>
              <SearchResultCard post={post} />
            </li>
          ))
        ) : (
          <div>검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default page;
