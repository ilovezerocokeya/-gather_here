import { Tables } from '@/types/supabase';

// Supabase Posts 테이블 타입 정의
type Post = Tables<'Posts'>;

// 주어진 텍스트에서 검색어(keyword)를 찾아 <mark> 태그로 감싸 강조하는 함수
export const highlightKeyword = (text: string, keyword: string): string => {
  if (!text || !keyword.trim()) return text;
  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 정규식 이스케이프
  const regex = new RegExp(`(${safeKeyword})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
};

// 검색 대상 포스트에서 keyword와 일치하는 항목이 있는지 확인하고 하이라이트된 데이터를 포함한 객체를 반환
export const getHighlightedData = ({
  post,
  keyword,
  rawKeyword,
}: {
  post: Post;
  keyword: string;
  rawKeyword: string;
}) => {
  // 검색 대상 필드 추출 및 기본값 처리
  const title = post.title ?? '';
  const content = post.content ?? '';
  const location = post.location ?? '';
  const place = post.place ?? '';
  const positions = Array.isArray(post.target_position) ? post.target_position : [];

  // 각 필드에 대해 keyword 포함 여부 판별
  const titleMatch = title.toLowerCase().includes(keyword);
  const contentMatch = content.toLowerCase().includes(keyword);
  const locationMatch = location.toLowerCase().includes(keyword);
  const placeMatch = place.toLowerCase().includes(keyword);
  const positionMatch = positions.some(
    (pos) => typeof pos === 'string' && pos.toLowerCase().includes(keyword)
  );

  // 매칭되는 필드가 하나도 없다면 null 반환
  if (!(titleMatch || contentMatch || locationMatch || placeMatch || positionMatch)) {
    return null;
  }

  // 매칭된 필드에 대해 하이라이트 적용
  const highlightTitle = titleMatch ? highlightKeyword(title, rawKeyword) : undefined;
  const highlightContent = contentMatch ? highlightKeyword(content, rawKeyword) : undefined;
  const highlightLocation = locationMatch ? highlightKeyword(location, rawKeyword) : undefined;
  const highlightPlace = placeMatch ? highlightKeyword(place, rawKeyword) : undefined;
  const highlightPositions = positions
  .filter((pos): pos is string => typeof pos === 'string') // 타입 정제
  .map((pos) =>
    pos.toLowerCase().includes(keyword) ? highlightKeyword(pos, rawKeyword) : pos
  );
  
  // 하나 이상의 필드에 실제 하이라이트가 포함된 경우 _highlight 객체 생성
  const hasHighlight =
    highlightTitle?.includes('<mark') ||
    highlightContent?.includes('<mark') ||
    highlightLocation?.includes('<mark') ||
    highlightPlace?.includes('<mark') ||
    highlightPositions.some((pos) => typeof pos === 'string' && pos.includes('<mark'));

  // 최종 결과 반환: 하이라이트 포함된 포스트 객체
  return {
    matched: true,
    highlightedPost: {
      ...post,
      ...(hasHighlight && {
        _highlight: {
          title: highlightTitle,
          content: highlightContent,
          location: highlightLocation,
          place: highlightPlace,
          target_position: highlightPositions,
        },
      }),
    },
  };
};