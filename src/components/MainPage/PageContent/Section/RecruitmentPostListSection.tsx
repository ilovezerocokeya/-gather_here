"use client";

import React from "react";
import PostCardLong from "@/components/Common/Card/PostCard/PostCardLong";
import SpinnerLoader from "@/components/Common/Loading/SpinnerLoader";
import InitialLoadingWrapper from "@/components/Common/Loading/InitialLoadingWrapper";
import AdCard from "@/components/MainPage/AdCard/AdCard";
import { PostWithUser } from "@/types/posts/Post.type";

interface RecruitmentPostListSectionProps {
  posts: PostWithUser[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void; 
  isError: boolean;
}

const RecruitmentPostListSection: React.FC<RecruitmentPostListSectionProps> = ({
  posts,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isError,
}) => {
  if (isError) {
    return (
      <div className="text-center text-red-500">
        서버 오류: 게시글을 불러오는 중 문제가 발생했습니다.
        <button
          onClick={() => void refetch()}
          className="bg-red-500 text-white p-2 rounded-md mt-4"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <InitialLoadingWrapper>
      {posts.length === 0 ? (
        <p className="text-center text-white">해당 조건에 맞는 게시물이 없습니다</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post, index) => (
            <React.Fragment key={`${post.post_id}_${index}`}>
              <PostCardLong post={post} />
              {(index + 1) % 5 === 0 && <AdCard key={`ad_${index}`} />}
            </React.Fragment>
          ))}
          {hasNextPage && isFetchingNextPage && (
            <div className="flex justify-center items-center w-full h-[80px]">
              <SpinnerLoader />
            </div>
          )}

          {!hasNextPage && (
            <div className="flex flex-col items-center py-10">
              <p className="text-white">모든 포스트를 불러왔습니다</p>
              <div className="h-[100px]" />
            </div>
          )}
        </div>
      )}
    </InitialLoadingWrapper>
  );
};

export default RecruitmentPostListSection;