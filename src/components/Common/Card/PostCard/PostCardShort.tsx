'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PostWithUser } from '@/types/posts/Post.type';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from '@/components/MainDetail/components/common/LikeButton';
import { secureImageUrl } from '@/utils/Image/imageUtils';
import { useUserStore } from '@/stores/useUserStore';
import { jobTitleClassMap } from '@/lib/postFormOptions';
import { getDisplayDaysLeft, cleanContent } from '@/utils/mainDetailUtils';

interface PostCardProps {
  post: PostWithUser;
  style?: React.CSSProperties;
  onRemoveBookmark?: () => void;
}

const PostCardShort: React.FC<PostCardProps> = ({ post, onRemoveBookmark }) => {
  const { userData } = useUserStore();
  const [isMounted, setIsMounted] = useState<boolean>(false); // 클라이언트 마운트 여부를 판단
  const displayDaysLeft = isMounted ? getDisplayDaysLeft(post.deadline) : ''; // 마감일까지 남은 날짜 계산

  useEffect(() => {
     // 컴포넌트가 마운트된 이후에만 표시되도록 플래그 설정
    setIsMounted(true);
    return () => {
      setIsMounted(false); // 언마운트 시 정리
    };
  }, [post]);

  // XSS 방지를 위해 게시글 본문을 정제하여 HTML로 렌더링
  const sanitizedContent = useMemo(() => {
      if (!isMounted || typeof window === 'undefined') return '';
      return cleanContent(post.content);
    }, [isMounted, post.content]);

    return (
      <div className="w-full h-full max-w-container-l m:max-w-container-m s:max-w-container-s post-card">
        <div className="p-5 h-64 text-center bg-fillStrong rounded-2xl">
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
                currentUser={userData}
                category={post.category}
                onRemoveBookmark={onRemoveBookmark}
              />
            </div>
          </div>
  
          <Link href={`/maindetail/${post.post_id}`}>
            <h2 className="text-left text-subtitle font-semibold truncate mt-3 text-labelStrong">
              {post.title}
            </h2>
  
            <div className="hidden sm:block mt-2 mb-3 h-11 overflow-hidden text-left font-thin line-clamp-2 text-labelNeutral">
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>
  
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