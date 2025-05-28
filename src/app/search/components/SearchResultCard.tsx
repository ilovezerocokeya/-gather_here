'use client';

import { Tables } from '@/types/supabase';
import dayjs from 'dayjs';
import Link from 'next/link';
import DOMPurify from 'dompurify';

type PostWithUser = Tables<'Posts'> & {
  _highlight?: {
    title?: string;
    content?: string;
    target_position?: string[];
    location?: string;
    place?: string;
  };
};

interface SearchResultCardProps {
  post: PostWithUser;
}

const SearchResultCard = ({ post }: SearchResultCardProps) => {
  const today = dayjs();
  const deadline = dayjs(post.deadline);
  const daysLeft = deadline.diff(today, 'day');

  const sanitize = (html: string) => DOMPurify.sanitize(html);

  const titleHTML = sanitize(post._highlight?.title ?? post.title ?? '');
  const contentHTML = sanitize(post._highlight?.content ?? post.content ?? '');
  const positions = (post._highlight?.target_position ?? post.target_position ?? []).map(
    (pos) => (typeof pos === 'string' ? sanitize(pos) : '')
  );
  const locationHTML = sanitize(post._highlight?.location ?? post.location ?? '');
  const placeHTML = sanitize(post._highlight?.place ?? post.place ?? '');

  return (
    <Link href={`/maindetail/${post.post_id}`}>
      <div className="w-[340px] h-[180px] bg-[#1b1c1d] rounded-2xl shadow-lg p-5 flex flex-col justify-between gap-2 hover:ring-2 hover:ring-[#c3e88d] transition duration-150">
        
        {/* 마감일 */}
        <div className="flex justify-between items-center text-xs">
          <span 
            className={`px-2 py-1 rounded-full font-semibold ${
              daysLeft < 0 ? 'bg-[#4c4c4c] text-[#999]' 
            : 'bg-[#3b3d3f] text-[#c3e88d]'
          }`}
          >
            {daysLeft < 0 ? `마감` : `D-${daysLeft}`}
          </span>
          <span className="text-[#c4c4c4]">~{deadline.format('MM.DD')}</span>
        </div>

        {/* 제목 */}
        <div
          className="text-lg font-semibold text-white truncate"
          dangerouslySetInnerHTML={{ __html: titleHTML }}
        />

        {/* 본문 */}
        <div
          className="text-sm text-[#aaaaaa] line-clamp-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contentHTML }}
        />

        {/* 직군, 장소, 지역 */}
        {(positions.length > 0 || placeHTML || locationHTML) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-xs text-[#bbbbbb]">
            
            {positions.map((pos, idx) => (
              <span
                key={`position-${idx}`}
                className="font-medium px-2 py-1 rounded-full bg-[#2d2d2f] text-[#fac66a]"
                dangerouslySetInnerHTML={{ __html: pos }}
              />
            ))}

            {placeHTML && (
              <div className="flex items-center">
                <strong className="text-white mr-1">장소:</strong>
                <span dangerouslySetInnerHTML={{ __html: placeHTML }} />
              </div>
            )}

            {locationHTML && (
              <div className="flex items-center">
                <strong className="text-white mr-1">지역:</strong>
                <span dangerouslySetInnerHTML={{ __html: locationHTML }} />
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchResultCard;