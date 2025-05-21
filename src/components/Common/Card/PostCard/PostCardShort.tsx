'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PostWithUser } from '@/types/posts/Post.type';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from '@/components/MainDetail/components/common/LikeButton';
import { secureImageUrl } from '@/utils/Image/imageUtils';
import { jobTitleClassMap } from '@/lib/postFormOptions';
import { getDisplayDaysLeft, cleanContent } from '@/utils/mainDetailUtils';

interface PostCardProps {
  post: PostWithUser;
  style?: React.CSSProperties;
  onRemoveBookmark?: () => void;
}

const PostCardShort: React.FC<PostCardProps> = ({ post, onRemoveBookmark }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 본문 내용 sanitize 처리 (XSS 방지)
  const sanitizedContent = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return '';
    return cleanContent(post.content);
  }, [isMounted, post.content]);

  // 마감일 계산
  const displayDaysLeft = isMounted ? getDisplayDaysLeft(post.deadline) : '';

    return (
      <div className="w-full h-full max-w-container-l m:max-w-container-m s:max-w-container-s post-card">
        <div className="p-5 h-64 text-center bg-fillStrong rounded-2xl">
          {/* 상단 정보: 마감일, 카테고리, 좋아요 */}
          <div className="flex justify-between items-center">
            {isMounted && (
              <ul className="flex items-center">
                <li>
                  <span className="label-secondary rounded-full text-baseS px-3 py-1.5 mr-1">
                    {displayDaysLeft}
                  </span>
                </li>
                <li>
                  <span className="bg-fillNormal text-primary text-baseS rounded-full px-3 py-1.5 mr-1">
                    {post.category}
                  </span>
                </li>
              </ul>
            )}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <LikeButton
                postId={post.post_id}
                category={post.category}
                onRemoveBookmark={onRemoveBookmark}
              />
            </div>
          </div>

          {/* 게시글 정보 (제목 + 본문 + 작성자 + 요약 정보) */}
          <Link href={`/maindetail/${post.post_id}`}>
            <h2 className="text-left text-subtitle font-semibold truncate mt-3 text-labelStrong">
              {post.title}
            </h2>
  
            {/* 본문 미리보기 */}
            <div className="hidden sm:block mt-2 mb-3 h-11 overflow-hidden text-left font-thin line-clamp-2 text-labelNeutral">
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>

            {/* 작성자 정보 (sm 이상에서만 표시) */}
            <div className="mt-1">
              <div className="flex items-center mb-4">
                <div className="hidden sm:flex items-center">
                  {post.user?.profile_image_url && (
                    <div className="relative w-7 h-7 mr-2">
                      <Image
                        src={secureImageUrl(post.user.profile_image_url)}
                        alt="프로필 사진"
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-labelNeutral truncate">
                    {post.user?.nickname}
                  </p>
                </div>
              </div>
  
              {/* 직군, 인원 */}
              <div className="flex items-center justify-between bg-fillNormal p-2 rounded-lg min-h-[20px]">
                <div className="flex-1 truncate text-left">
                  {post.target_position?.length > 0 && (
                    <>
                      <span className={`${jobTitleClassMap[post.target_position[0]] || 'text-default'}`}>
                        {post.target_position[0]}
                      </span>
                      {post.target_position.length > 1 && (
                        <span className="ml-1 text-default">+{post.target_position.length - 1}</span>
                      )}
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`${jobTitleClassMap[post.target_position?.[0]] || 'text-default'}`}>
                    {post.recruitmentCount}명
                  </span>
                  <Image
                    src="/assets/cardarrow.svg"
                    alt="화살표"
                    width={10}
                    height={10}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  };
  
  export default PostCardShort;