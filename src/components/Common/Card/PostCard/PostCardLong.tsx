'use client';

import { PostWithUser } from '@/types/posts/Post.type';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import LikeButton from '@/components/MainDetail/components/common/LikeButton';
import { secureImageUrl } from '@/utils/Image/imageUtils';
import { jobTitleClassMap } from '@/lib/postFormOptions';
import { getDisplayDaysLeft, cleanContent } from '@/utils/mainDetailUtils';

interface PostCardProps {
  post: PostWithUser;
  onRemoveBookmark?: () => void;
}

const PostCardLong: React.FC<PostCardProps> = ({ post, onRemoveBookmark }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false); // 클라이언트 사이드 렌더링 여부 확인용
  const displayDaysLeft = isMounted ? getDisplayDaysLeft(post.deadline) : ''; // 마감일까지 남은 날짜 계산

  useEffect(() => {
    setIsMounted(true);  // 컴포넌트가 마운트된 이후에만 표시되도록 플래그 설정
    return () => setIsMounted(false); // 언마운트 시 정리
  }, []);

  // 게시글 본문을 sanitize해서 XSS 방지 후 렌더링
  const sanitizedContent = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return '';
    return cleanContent(post.content);
  }, [isMounted, post.content]);

  return (
    <div className="w-auto p-5 bg-fillStrong rounded-2xl mb-4">
      {/* 상단 정보 바 (마감일, 카테고리, 날짜, 좋아요 버튼) */}
      <div className="flex justify-between items-center">
        {isMounted && (
          <ul className="flex items-center relative w-full">
            <li>
              <span className="label-secondary rounded-full text-baseS px-3 py-1.5 mr-1">{displayDaysLeft}</span>
            </li>
            <li>
              <span className="bg-fillNormal text-primary text-baseS rounded-full px-3 py-1.5 mr-1">
                {post.category}
              </span>
            </li>
            <li className="text-baseS text-labelNormal ml-2">
            <time dateTime={dayjs(post.deadline).format('YYYY-MM-DD')}>
              ~{dayjs(post.deadline).format('YY.MM.DD')}
            </time>
            </li>
            <li className="absolute right-0">
              {/* 관심글 추가/제거 버튼 */}
              <div className="transition-transform duration-200 md:hover:rotate-[8deg] md:hover:scale-110">
                <LikeButton
                  postId={post.post_id}
                  category={post.category}
                  onRemoveBookmark={onRemoveBookmark}
                  />
              </div>
            </li>
          </ul>
        )}
      </div>
      {/* 게시글 제목, 본문, 유저 정보 영역 */}
      <Link href={`/maindetail/${post.post_id}`}>
        <h2 className="text-left text-subtitle mt-3 font-semibold text-labelStrong truncate w-3/4">{post.title}</h2>
        
        {/* 게시글 본문 미리보기 (2줄 제한) */}
        <div className="mt-2 mb-4 h-[45px] s:h-11 xs:h-14 overflow-hidden text-left text-labelNeutral font-thin">
          <div 
            className="line-clamp-2 transition-all duration-300 ease-in-out md:hover:scale-[1.015] 
            md:hover:tracking-wide origin-left" dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
        {/* 작성자 프로필 이미지 + 닉네임 */}
        <div className="flex items-center mb-4">
          {post.user?.profile_image_url && (
            <div className="relative w-7 h-7 mr-2">
              <Image
                src={secureImageUrl(post.user.profile_image_url)}
                alt={`${post.user?.nickname ?? '유저'}님의 프로필 사진`}
                fill
                className="rounded-md object-cover"
              />
            </div>
          )}
          <p className="text-sm text-gray-200">{post.user?.nickname}</p>
        </div>

        {/* 직군, 방식, 지역, 인원수 등 하단 정보 */}
        <div className="text-base flex items-center justify-between bg-fillNormal p-3 rounded-lg truncate md:hover:text-primary transition-colors duration-200">
          {/* 직군 정보 */}
          <div className="flex-1 text-left truncate">
            {post.target_position.map((position, index) => (
              <span key={index} className={`${jobTitleClassMap[position] || 'text-default'}`}>
                {position}
                {index < post.target_position.length - 1 && (
                  <span className="mx-2 text-labelAssistive">|</span>
                )}
              </span>
            ))}
          </div>

          {/* 방식 + 지역 표시 */}
          <div className="flex flex-wrap items-center justify-start text-sm text-text-gray-200 gap-3">
            {post.place && (
              <span className="px-2 py-1 rounded bg-fillWeak">
                {post.place}
              </span>
            )}
            {post.location && (
              <span className="px-2 py-1 rounded bg-fillWeak">
                {post.location}
              </span>
            )}
          </div>

          {/* 모집 인원수 */}
          <div className="flex items-center flex-none">
            <div className={`mr-2 ${jobTitleClassMap[post.target_position[0]] || 'text-default'}`}>
              {post.recruitmentCount}명
            </div>
            <div className="flex items-center">
              <Image
                src="/assets/cardarrow.svg"
                alt=""
                width={10}
                height={10}
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCardLong;