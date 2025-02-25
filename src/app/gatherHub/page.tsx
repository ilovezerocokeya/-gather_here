"use client";
import React, { useState, useMemo, useEffect } from "react";
import MemberCard from "@/components/GatherHub/MemberCard";
import JobDirectory from "@/components/GatherHub/JobDirectory";
import { useUserData } from "@/provider/user/UserDataProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useLikeStore } from "@/stores/useLikeStore";

// 멤버 카드 인터페이스 정의
interface MemberCardProps {
  id: string;
  nickname: string;
  job_title: string;
  experience: string;
  background_image_url: string;
  profile_image_url: string;
  blog: string;
  notionLink: string;
  instagramLink: string;
  liked: boolean;
  description: string;
  answer1: string;
  answer2: string;
  answer3: string;
  first_link_type?: string;
  first_link?: string;
  second_link_type?: string;
  second_link?: string;
  tech_stacks?: string[];
}

// 유저 데이터를 페이지네이션으로 가져오는 함수
const fetchMembers = async ({ pageParam = 1 }) => {
  const response = await fetch(`/api/gatherHub?page=${pageParam}&limit=10`);
  const data = await response.json();

  return {
    members: data.members as MemberCardProps[],
    nextPage: data.members.length === 10 ? pageParam + 1 : undefined,
  };
};

const GatherHubPage: React.FC = () => {
  const { userData } = useUserData();
  const { likedMembers, toggleLike, hydrate, syncLikesWithServer } = useLikeStore();

  const isHubRegistered = userData?.hubCard || false;
  const [filteredJob, setFilteredJob] = useState<string>("all");

  // React Query를 사용한 무한 스크롤 데이터 로드
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
    queryFn: fetchMembers,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    staleTime: 60000,
    initialPageParam: 1,
  });

  // zustand에서 좋아요 상태 동기화
  useEffect(() => {
    if (userData?.user_id) {
      hydrate(userData.user_id);
      syncLikesWithServer(userData.user_id);
    }
  }, [userData?.user_id, hydrate, syncLikesWithServer]);

  // 세션 스토리지를 이용한 스크롤 위치 저장
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, []);

  // 무한 스크롤 로직
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
      ) {
        fetchNextPage();
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 프로필 및 배경 이미지 URL의 보안 강화를 위한 변환 함수
  const secureImageUrl = (url: string) => url.replace(/^http:/, "https:");

  // 전체 멤버 데이터 구성
  const allMembers = useMemo(() => {
    const userMember = isHubRegistered && userData
      ? [
          {
            id: userData.user_id || "",
            nickname: userData.nickname || "",
            job_title: userData.job_title || "",
            experience: userData.experience || "",
            blog: userData.blog || "",
            description: userData.description || "항상 사용자의 입장에서 친절한 화면을 지향합니다.",
            background_image_url: "",
            profile_image_url: secureImageUrl(userData.profile_image_url || ""),
            answer1: userData.answer1 || "기본 답변 1",
            answer2: userData.answer2 || "기본 답변 2",
            answer3: userData.answer3 || "기본 답변 3",
            notionLink: "https://www.notion.so/",
            instagramLink: "https://www.instagram.com/",
            liked: likedMembers[userData.nickname || ""] || false,
            first_link_type: "",
            first_link: "",
            second_link_type: "",
            second_link: "",
            tech_stacks: [],
          },
        ]
      : [];

    const serverMembers = data?.pages.flatMap((page) =>
      page.members.map((member: MemberCardProps) => ({
        ...member,
        profile_image_url: secureImageUrl(member.profile_image_url || ""),
        liked: likedMembers[member.nickname] || false,
        first_link_type: member.first_link_type || "",
        first_link: member.first_link || "",
        second_link_type: member.second_link_type || "",
        second_link: member.second_link || "",
        tech_stacks: member.tech_stacks || [],
      }))
    ) || [];

    return [...userMember, ...serverMembers];
  }, [isHubRegistered, userData, data, likedMembers]);

  // 필터링된 멤버 데이터 반환
  const filteredMembers = useMemo(() => {
    return filteredJob === "all"
      ? allMembers.filter((member) => member.nickname && member.job_title && member.profile_image_url)
      : allMembers.filter((member) => member.job_title?.toLowerCase() === filteredJob);
  }, [allMembers, filteredJob]);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        서버 오류: 데이터를 로드 중 문제가 발생했습니다.
        <button onClick={() => refetch()} className="bg-red-500 text-white p-2 rounded-md mt-4">
          다시 시도
        </button>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-4 py-8">
        {/* 작은 화면에서 JobDirectory */}
        <div className="mb-6 lg:hidden">
          <JobDirectory setFilteredJob={setFilteredJob} className="w-full" />
        </div>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ml-8 justify-items-center">
          {filteredMembers.map((member, index) => (
            <div key={`${member.nickname}-${index}`}>
              <MemberCard
                {...member}
                liked={likedMembers[member.nickname] || false}
                toggleLike={() => toggleLike(member.nickname, userData?.user_id || "")}
              />
            </div>
          ))}
        </div>
        {/* 큰 화면에서 JobDirectory */}
        <div className="hidden lg:block lg:ml-10 lg:w-40 mt-[-5px]">
          <JobDirectory setFilteredJob={setFilteredJob} />
        </div>
      </div>
    </div>
  );
};

export default GatherHubPage;