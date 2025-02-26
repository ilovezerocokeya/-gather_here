"use client";
import { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLikeStore } from "@/stores/useLikeStore";
import { useUserData } from "@/provider/user/UserDataProvider";
import { fetchMembers } from "@/utils/fetchMembers";
import { throttle } from "lodash";
import { MemberCardProps, UseMemberDataReturn } from "@/lib/gatherHub";

// 초기 데이터를 받아서 무한스크롤 적용
export const useMemberData = (
  initialMembers: MemberCardProps[],
  initialNextPage?: number
): UseMemberDataReturn => {
  const { userData } = useUserData();
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
    queryKey: ["members"],
    queryFn: ({ pageParam = 1 }) => fetchMembers(pageParam),
    initialData: {
      pages: [{ members: initialMembers, nextPage: initialNextPage }],
      pageParams: [initialNextPage ?? 1],
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    staleTime: 60000,
    initialPageParam: initialNextPage ?? 1,
  });

  // zustand에서 좋아요 상태 동기화
  useEffect(() => {
    if (!userData?.user_id) 
    return;

    hydrate(userData.user_id);
    syncLikesWithServer(userData.user_id);
  }, [userData?.user_id]);

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
      ) {
        fetchNextPage();
      }
    }, 300); // 300ms로 최적화

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 전체 멤버 데이터 구성
  const allMembers = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        page.members.map((member) => ({
          ...member,
          liked: likedMembers[member.user_id] || false, // 좋아요 상태 반영
        }))
      ) || []
    );
  }, [data, likedMembers]);

  // 필터링된 멤버 데이터 반환
  const filteredMembers = useMemo(() => {
    return filteredJob === "all"
      ? allMembers
      : allMembers.filter((member) => member.job_title?.toLowerCase() === filteredJob);
  }, [allMembers, filteredJob]);

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