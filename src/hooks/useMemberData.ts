"use client";
import { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLikeStore } from "@/stores/useLikeStore";
import { useUserStore } from "@/stores/useUserStore";
import { fetchMembers } from "@/utils/fetchMembers";
import { ReactQueryInfiniteScrollHandler } from "@/utils/scroll/InfinityScroll";
import { MemberType, UseMemberDataReturn } from "@/lib/gatherHub";

// 초기 데이터를 받아서 무한스크롤 적용
export const useMemberData = (
  initialMembers: MemberType[],
): UseMemberDataReturn => {
  const { userData } = useUserStore();
  const { likedMembers, hydrate, syncLikesWithServer } = useLikeStore();
  const [filteredJob, setFilteredJob] = useState<string>("all");

  // React Query를 사용한 무한스크롤 데이터 로드
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["members", filteredJob],
    queryFn: ({ pageParam = 1 }) => fetchMembers(pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    staleTime: 60000,
    initialPageParam: 1,
    initialData: {
      pages: [
        {
          members: initialMembers,
          nextPage: initialMembers.length === 10 ? 2 : undefined,
          totalPages: 1,
        },
      ],
      pageParams: [1],
    },
  });

  // Zustand에서 좋아요 상태 동기화
  useEffect(() => {
    if (!userData?.user_id) return;

    hydrate(userData.user_id);
    void syncLikesWithServer(userData.user_id);
  }, [userData?.user_id]);

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = ReactQueryInfiniteScrollHandler({
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      threshold: 200,
      throttleMs: 400,     
    });
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 전체 멤버 데이터 구성 
  const allMembers = useMemo(() => {
    if (!data?.pages) return initialMembers;
    return data.pages.flatMap((page) => page.members).filter(Boolean);
  }, [data, initialMembers]);

  // 필터링된 멤버 데이터 
  const filteredMembers = useMemo(() => {
    const members = filteredJob === "all"
      ? allMembers
      : allMembers.filter(member => member.job_title?.toLowerCase() === filteredJob);
  
    return members.map(member => ({
      ...member,
      liked: likedMembers[member.user_id] || false, 
    }));
  }, [allMembers, filteredJob, likedMembers]);


  return {
    filteredMembers,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    setFilteredJob,
  };
};