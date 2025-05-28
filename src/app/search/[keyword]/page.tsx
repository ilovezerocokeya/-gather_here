import { createServerSupabaseClient } from '@/utils/supabase/server';
import SearchResultCard from '../components/SearchResultCard';
import { Tables } from '@/types/supabase';
import Pagination from '@/components/GatherHub/Pagination';
import { getHighlightedData } from '@/utils/Search/highlight';

interface SearchPageProps {
  params: { keyword?: string };
  searchParams: { page?: string };
}

const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
  const supabase = createServerSupabaseClient();

  // 키워드 파싱 및 페이지네이션 범위 설정
  const rawKeyword = decodeURIComponent(params.keyword ?? '').trim();
  const keyword = rawKeyword.toLowerCase();
  const currentPage = Number(searchParams.page ?? '1');
  const pageSize = 9;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;

  // Supabase에서 title, content, location, place에 대해 or 조건으로 검색
  const filters = [
    `title.ilike.%${keyword}%`,
    `content.ilike.%${keyword}%`,
    `location.ilike.%${keyword}%`,
    `place.ilike.%${keyword}%`
  ].join(',');

  const { data: supabaseData, error } = await supabase
    .from('Posts')
    .select('*', { count: 'exact' })
    .or(filters);

  if (error) {
    console.error('[Supabase 오류]', error);
    return (
      <div className="text-center text-red-400 mt-20">
        서버에서 데이터를 가져오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 전체 게시글 조회 후 target_position 필드에서 키워드 포함 여부 검사 
  const needsPositionMatch = keyword.length > 0;
  const { data: allPosts } = needsPositionMatch
    ? await supabase.from('Posts').select('*')
    : { data: [] };

  const matchedByPosition = (allPosts ?? []).filter((post) => {
    const positions = post.target_position ?? [];
    return positions.some(
      (pos) => typeof pos === 'string' && pos.toLowerCase().includes(keyword)
    );
  });

  // supabaseData + matchedByPosition를 post_id 기준으로 중복 제거하며 병합
  const merged = [
    ...(supabaseData ?? []),
    ...matchedByPosition.filter(
      (post) => !(supabaseData ?? []).some((d) => d.post_id === post.post_id)
    ),
  ];

  // 총 페이지 계산
  const totalPages = Math.ceil(merged.length / pageSize);

  // 현재 페이지에 해당하는 게시글 추출 + 하이라이트 처리
  const highlightedData = merged.slice(from, to).map((post) => {
    const result = getHighlightedData({ post, keyword, rawKeyword });
    return result?.highlightedPost ?? post;
  });

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 pt-24">
      <h2 className="text-2xl font-semibold text-white mb-8 text-center">
        🔍 “{rawKeyword}” 검색 결과
      </h2>

      {highlightedData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 s:gap-4 md:gap-10 lg:gap-6 md:ml-20 place-items-center">
            {highlightedData.map((post) => (
              <SearchResultCard key={post.post_id} post={post as Tables<'Posts'>} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center text-white text-xl font-semibold mt-20 flex flex-col items-center gap-3">
          <span className="text-4xl">😢</span>
          <p>“{rawKeyword}”에 대한 검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-400">다른 키워드로 다시 검색해보세요.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;