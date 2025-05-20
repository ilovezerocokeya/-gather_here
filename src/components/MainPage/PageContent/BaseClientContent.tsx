"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/fetchPosts";
import { PostWithUser } from "@/types/posts/Post.type";
import useSearch from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { ReactQueryInfiniteScrollHandler } from "@/utils/scroll/InfinityScroll";
import RecruitmentTopSection from "./Section/RecruitmentTopSection";
import RecruitmentPostListSection from "./Section/RecruitmentPostListSection";

interface BaseClientContentProps {
  category: "스터디" | "프로젝트"; 
  scrollKey: string;               
  initialPosts: PostWithUser[];   
  initialCarouselPosts: PostWithUser[]; 
}

const BaseClientContent: React.FC<BaseClientContentProps> = ({
  category,
  scrollKey,
  initialPosts,
  initialCarouselPosts,
}) => {
  // 필터 조건들
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const { searchWord } = useSearch();
  const debouncedSearchWord = useDebounce(searchWord, 300);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (position: string, place: string, location: string, duration: number | null) => {
      setSelectedPosition(position);
      setSelectedPlace(place);
      setSelectedLocation(location);
      setSelectedDuration(duration);
    },
    []
  );

  // 게시글 무한스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isError,
  } = useInfiniteQuery({
    queryKey: [category], // 카테고리별 캐시 분리
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, category),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.length > 0 ? lastPage.length + 1 : undefined,
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchInterval: false,
  });

  // 무한스크롤 핸들러 등록
  useEffect(() => {
    const handler = ReactQueryInfiniteScrollHandler({
      hasNextPage: !!hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      threshold: 300,
      throttleMs: 300,
    });
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 게시글 데이터 가져오기 완료된 경우 스크롤 복원 가능
  const canRestore = !isFetching && !isFetchingNextPage;
  useScrollRestoration(scrollKey, canRestore);

  // 모든 페이지의 게시글을 하나의 배열로 평탄화
  const posts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page);
  }, [data]);

  // 게시글 목록에서 필터 조건과 검색어를 기준으로 필터링된 결과를 반환
const filteredPosts = useMemo(() => {
  // 게시글이 아직 로드되지 않았으면 빈 배열 반환
  if (!posts) return [];

  // 1. 현재 선택된 카테고리에 해당하는 게시글만 필터링
  let temp = posts.filter((post) => post.category === category);

  // 2. 포지션 필터가 선택되어 있는 경우
  if (selectedPosition) {
    // 소문자로 변환하고 공백 제거하여 비교 준비
    const normalized = selectedPosition.toLowerCase().trim();

    // 각 포지션 중 하나라도 선택된 포지션을 포함하고 있으면 통과
    temp = temp.filter((post) =>
      (Array.isArray(post.target_position) ? post.target_position : [post.target_position])
        .some((position) => position?.toLowerCase().includes(normalized))
    );
  }

  // 3. 진행 방식을 선택한 경우
  if (selectedPlace) {
    temp = temp.filter((post) => post.place === selectedPlace);
  }

  // 4. 상세 지역을 선택한 경우
  if (selectedLocation) {
    temp = temp.filter((post) => post.location === selectedLocation);
  }

  // 5. 검색어가 입력된 경우
  if (debouncedSearchWord) {
    const lower = debouncedSearchWord.toLowerCase(); // 대소문자 구분 없이 비교

    // 제목 또는 본문에 검색어가 포함되어 있으면 통과
    temp = temp.filter(
      (post) =>
        post.title?.toLowerCase().includes(lower) ||
        post.content?.toLowerCase().includes(lower)
    );
  }

  // 모든 필터를 통과한 게시글 목록 반환
  return temp;
}, [posts, category, selectedPosition, selectedPlace, selectedLocation, debouncedSearchWord]);

  return (
    <div className="w-full">
      {/* 상단 캐러셀 + 필터 섹션 */}
      <RecruitmentTopSection
        initialCarouselPosts={initialCarouselPosts}
        selectedPosition={selectedPosition}
        selectedPlace={selectedPlace}
        selectedLocation={selectedLocation}
        selectedDuration={selectedDuration}
        onChange={handleFilterChange}
      />

      {/* 게시글 목록 섹션 */}
      <RecruitmentPostListSection
        posts={filteredPosts}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={() => void refetch()}
        isError={isError}
      />
    </div>
  );
};

export default BaseClientContent;