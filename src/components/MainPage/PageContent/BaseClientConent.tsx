'use client';

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
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const { searchWord } = useSearch();
  const debouncedSearchWord = useDebounce(searchWord, 300);

  const handleFilterChange = useCallback(
    (position: string, place: string, location: string, duration: number | null) => {
      setSelectedPosition(position);
      setSelectedPlace(place);
      setSelectedLocation(location);
      setSelectedDuration(duration);
    },
    []
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isError,
  } = useInfiniteQuery({
    queryKey: [category],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, category),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.length > 0 ? lastPage.length + 1 : undefined),
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
    staleTime: 10000,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchInterval: false,
  });

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

  const canRestore = !isFetching && !isFetchingNextPage;
  useScrollRestoration(scrollKey, canRestore);

  const posts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page);
  }, [data]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let temp = posts.filter((post) => post.category === category);

    if (selectedPosition) {
      const normalized = selectedPosition.toLowerCase().trim();
      temp = temp.filter((post) =>
        (Array.isArray(post.target_position) ? post.target_position : [post.target_position])
          .some((position) => position?.toLowerCase().includes(normalized))
      );
    }

    if (selectedPlace) {
      temp = temp.filter((post) => post.place === selectedPlace);
    }

    if (selectedLocation) {
      temp = temp.filter((post) => post.location === selectedLocation);
    }

    if (debouncedSearchWord) {
      const lower = debouncedSearchWord.toLowerCase();
      temp = temp.filter(
        (post) =>
          post.title?.toLowerCase().includes(lower) ||
          post.content?.toLowerCase().includes(lower)
      );
    }

    return temp;
  }, [posts, category, selectedPosition, selectedPlace, selectedLocation, debouncedSearchWord]);

  return (
    <div className="w-full">
      <RecruitmentTopSection
        initialCarouselPosts={initialCarouselPosts}
        selectedPosition={selectedPosition}
        selectedPlace={selectedPlace}
        selectedLocation={selectedLocation}
        selectedDuration={selectedDuration}
        onChange={handleFilterChange}
      />

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