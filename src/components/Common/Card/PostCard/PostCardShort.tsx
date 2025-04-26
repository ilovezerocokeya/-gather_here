'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PostWithUser } from '@/types/posts/Post.type';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from '@/components/MainDetail/components/common/LikeButton';
import dayjs from 'dayjs';
import { secureImageUrl } from '@/utils/imageUtils';
import { useUserData } from '@/provider/user/UserDataProvider';
import { jobTitleClassMap } from '@/lib/postFormOptions';
import { getDisplayDaysLeft, cleanContent } from '@/utils/mainDetailUtils';

interface PostCardProps {
  post: PostWithUser;
  style?: React.CSSProperties;
}

const PostCardShort: React.FC<PostCardProps> = ({ post }) => {
  const { userData } = useUserData();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const displayDaysLeft = isMounted ? getDisplayDaysLeft(post.deadline) : '';

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [post]);

  const sanitizedContent = useMemo(() => {
      if (!isMounted || typeof window === 'undefined') return '';
      return cleanContent(post.content);
    }, [isMounted, post.content]);

  return (
    <div className="w-full h-full max-w-container-l m:max-w-container-m s:max-w-container-s post-card">
      <div className="p-5 h-64 text-center bg-fillStrong rounded-2xl">
        <div className="flex justify-between items-center">
          {isMounted ? (
            <ul className="flex items-center">
              <li>
                <span className="label-secondary rounded-full text-baseS  px-3 py-1.5 mr-1">{displayDaysLeft}</span>
              </li>
              <li className="text-baseS  text-labelNormal ml-2">
                <time dateTime="YYYY-MM-DD">~{dayjs(post.deadline).format('YY.MM.DD')}</time>
              </li>
            </ul>
          ) : null}
          <LikeButton postId={post.post_id} currentUser={userData} category={post.category} />
        </div>
        <Link href={`/maindetail/${post.post_id}`}>
          <h2 className="text-left text-subtitle font-semibold truncate mt-3 text-labelStrong">{post.title}</h2>
          <div className="hidden sm:block mt-2 mb-3 h-11 overflow-hidden text-left font-thin line-clamp-2 text-labelNeutral">
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>
          <div className="mt-1">
            <div className="flex items-center mb-4">
              <div className="hidden sm:flex items-center">
                {post.user?.profile_image_url && (
                  <div className="relative w-7 h-7 mr-2">
                    <Image
                      src={secureImageUrl(post.user?.profile_image_url)}
                      alt="프로필 사진"
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-labelNeutral truncate">{post.user?.nickname}</p>
              </div>
            </div>
            <div className="text-subtitle xs:text-base flex items-center justify-between bg-fillNormal p-3 xs:p-2 rounded-lg truncate">
              <div className="flex-1 text-left truncate">
                {post.target_position?.length > 0 && (
                  <>
                    <span className={`${jobTitleClassMap[post.target_position[0]] || 'text-default'}`}>
                      {post.target_position[0]}
                    </span>
                    {post.target_position.length > 1 && (
                      <span className={`${jobTitleClassMap[post.target_position[0]] || 'text-default'}`}>
                        +{post.target_position.length - 1}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className={`mr-2 ${jobTitleClassMap[post.target_position?.[0]] || 'text-default'}`}>
                {post.recruitmentCount}명
              </div>
              <div className="flex items-center">
                <Image
                  src="/assets/cardarrow.svg"
                  alt="Puzzle Icon"
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
