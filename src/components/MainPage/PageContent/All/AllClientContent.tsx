"use client";

import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/fetchPosts";
import { PostWithUser } from "@/types/posts/Post.type";
import useSearch from "@/hooks/useSearch";
import { ReactQueryInfiniteScrollHandler } from "@/utils/scroll/InfinityScroll";
import PostCardLong from "@/components/Common/Card/PostCard/PostCardLong";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import AdCard from "@/components/MainPage/AdCard/AdCard";
import { useDebounce } from "@/hooks/useDebounce";
import SpinnerLoader from "@/components/Common/Loading/SpinnerLoader";
import InitialLoadingWrapper from "@/components/Common/Loading/InitialLoadingWrapper";

interface AllClientContentProps {
  initialPosts: PostWithUser[];
}

const AllClientContent: React.FC<AllClientContentProps> = ({ initialPosts }) => {
  const { searchWord } = useSearch();
  const debouncedSearchWord = useDebounce(searchWord, 300); // 검색어 입력 디바운스 처리

  // 게시글 무한스크롤 쿼리
  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["all-posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => lastPage.length > 0 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
    staleTime: 60000, // 1분 동안은 캐시 유지
  });

  const canRestore = !isFetching && !isFetchingNextPage;
  
  useScrollRestoration("all-page-scroll", canRestore);   // 스크롤 복원 및 저장 훅 적용

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = ReactQueryInfiniteScrollHandler({
      hasNextPage: !!hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      threshold: 300, // 300px 남았을 때 트리거
      throttleMs: 300, // 호출 간 딜레이
    });

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 전체 포스트 평탄화
  const posts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page);
  }, [data]);

  // 검색어 필터링
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchWord) return posts;
    const lowerSearchWord = debouncedSearchWord.toLowerCase();
    return posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(lowerSearchWord) ??
        post.content.toLowerCase().includes(lowerSearchWord),
    );
  }, [posts, debouncedSearchWord]);

  // 에러 핸들링
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
      <div className="flex items-center">
        <Image src="/assets/gif/puzzle.webp" alt="Puzzle Icon" width={20} height={20} className="mb-3" />
        <p className="m-2 mb-4 text-labelNormal">나에게 꼭 맞는 동료들을 찾아보세요</p>
      </div>

      {filteredPosts.length === 0 ? (
        <p style={{ textAlign: "center", color: "white" }}>해당 조건에 맞는 게시물이 없습니다</p>
      ) : (
        <div className="flex flex-col gap-6 pb-[120px]">
          {filteredPosts.map((post, index) => (
            <React.Fragment key={`${post.post_id}_${index}`}>
               {/* 각각의 포스트 카드 렌더링 */}
                <PostCardLong post={post} /> 
                {/* 5번째마다 광고 카드(AdCard) 삽입 */}
              {(index + 1) % 5 === 0 && <AdCard key={`ad_${index}`} />}
            </React.Fragment>
          ))}

          {/* 추가 데이터 로딩 중이면 스피너 */}
          {hasNextPage && isFetchingNextPage && (
            <div className="flex justify-center items-center w-full h-[80px]">
              <SpinnerLoader />
            </div>
          )}

          {/* 모든 데이터 불러오면 끝 문구 */}
          {!hasNextPage && (
            <p className="text-center text-white py-8">
              모든 포스트를 불러왔습니다
            </p>
          )}
        </div>
      )}
    </InitialLoadingWrapper>
  );
};

export default AllClientContent;