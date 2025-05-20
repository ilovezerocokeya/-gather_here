import { createServerSupabaseClient } from '@/utils/supabase/server';
import SearchResultCard from '../components/SearchResultCard';
import { Tables } from '@/types/supabase';

interface HighlightedPost extends Tables<'Posts'> {
  _highlight?: {
    title?: string;
    content?: string;
    target_position?: string[];
    location?: string;
    place?: string;
  };
}

const highlightKeyword = (text: string, keyword: string): string => {
  if (!text || !keyword) return text;
  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeKeyword})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
};

const SearchPage = async ({ params }: { params: { keyword?: string } }) => {
  const supabase = createServerSupabaseClient();
  const rawKeyword = decodeURIComponent(params.keyword ?? '').trim();
  const keyword = rawKeyword.toLowerCase();

  if (!keyword) {
    return (
      <div className="w-full text-center text-white mt-40 text-lg">
        검색어가 비어 있습니다.
      </div>
    );
  }

  const { data, error } = await supabase.from('Posts').select('*');
  if (error) console.log('[DEBUG] Supabase 오류:', error);

  const filtered: HighlightedPost[] = (data ?? []).reduce<HighlightedPost[]>((acc, post) => {
    const title = post.title ?? '';
    const content = post.content ?? '';
    const location = post.location ?? '';
    const place = post.place ?? '';
    const positions = Array.isArray(post.target_position) ? post.target_position : [];

    const titleMatch = title.toLowerCase().includes(keyword);
    const contentMatch = content.toLowerCase().includes(keyword);
    const locationMatch = location.toLowerCase().includes(keyword);
    const placeMatch = place.toLowerCase().includes(keyword);
    const positionMatch = positions.some((pos) =>
      typeof pos === 'string' && pos.toLowerCase().includes(keyword)
    );

    const highlightTitle = titleMatch ? highlightKeyword(title, rawKeyword) : undefined;
    const highlightContent = contentMatch ? highlightKeyword(content, rawKeyword) : undefined;
    const highlightLocation = locationMatch ? highlightKeyword(location, rawKeyword) : undefined;
    const highlightPlace = placeMatch ? highlightKeyword(place, rawKeyword) : undefined;
    const highlightPositions = positions.map((pos) =>
      typeof pos === 'string' && pos.toLowerCase().includes(keyword)
        ? highlightKeyword(pos, rawKeyword)
        : pos
    );

    if (titleMatch || contentMatch || positionMatch || locationMatch || placeMatch) {
      acc.push({
        ...post,
        _highlight: {
          title: highlightTitle,
          content: highlightContent,
          location: highlightLocation,
          place: highlightPlace,
          target_position: highlightPositions,
        },
      });
    }

    return acc;
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 pt-24">
      <h2 className="text-2xl font-semibold text-white mb-8 text-center">
        🔍 “{rawKeyword}” 검색 결과
      </h2>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 s:gap-4 md:gap-10 lg:gap-6 md:ml-20 place-items-center">
          {filtered.map((post) => (
            <SearchResultCard key={post.post_id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-[#999] mt-10 text-lg">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default SearchPage;