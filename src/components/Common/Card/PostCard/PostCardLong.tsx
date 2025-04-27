'use client';

import { PostWithUser } from '@/types/posts/Post.type';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import LikeButton from '@/components/MainDetail/components/common/LikeButton';
import { secureImageUrl } from '@/utils/Image/imageUtils';
import { useUserData } from '@/provider/user/UserDataProvider';
import { jobTitleClassMap } from '@/lib/postFormOptions';
import { getDisplayDaysLeft, cleanContent } from '@/utils/mainDetailUtils';

interface PostCardProps {
  post: PostWithUser;
  onRemoveBookmark?: () => void;
}

const PostCardLong: React.FC<PostCardProps> = ({ post, onRemoveBookmark }) => {
  const { userData } = useUserData();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const displayDaysLeft = isMounted ? getDisplayDaysLeft(post.deadline) : '';

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const sanitizedContent = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return '';
    return cleanContent(post.content);
  }, [isMounted, post.content]);

  return (
    <div className="w-auto p-5 bg-fillStrong rounded-2xl mb-4">
      <div className="flex justify-between items-center" />
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
              <time dateTime="YYYY-MM-DD">~{dayjs(post.deadline).format('YY.MM.DD')}</time>
            </li>
            <li className="absolute right-0">
              <LikeButton
                postId={post.post_id}
                currentUser={userData}
                category={post.category}
                onRemoveBookmark={onRemoveBookmark}
              />
            </li>
          </ul>
        )}
      </div>
      <Link href={`/maindetail/${post.post_id}`}>
        <h2 className="text-left text-subtitle mt-3 font-semibold text-labelStrong truncate w-3/4">{post.title}</h2>
        <div className="mt-2 mb-4 h-[45px] s:h-11 xs:h-14 overflow-hidden text-left text-labelNeutral font-thin">
          <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
        <div className="flex items-center mb-4">
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
          <p className="text-sm text-gray-500">{post.user?.nickname}</p>
        </div>
        <div className="text-base flex items-center justify-between bg-fillNormal p-3 rounded-lg truncate">
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
          <div className="flex flex-wrap items-center justify-start text-sm text-labelNeutral gap-3">
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

          <div className="flex items-center flex-none">
            <div className={`mr-2 ${jobTitleClassMap[post.target_position[0]] || 'text-default'}`}>
              {post.recruitmentCount}명
            </div>
            <div className="flex items-center">
              <Image
                src="/assets/cardarrow.svg"
                alt="화살표 아이콘"
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