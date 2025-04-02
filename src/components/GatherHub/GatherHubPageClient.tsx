"use client";
import React, { useEffect } from "react";
import MemberList from "./MemberList";
import JobDirectory from "@/components/GatherHub/JobDirectory";
import { useMemberData } from "@/hooks/useMemberData";
import { GatherHubPageClientProps } from "@/lib/gatherHub"; 
import { throttle } from "lodash";
import SpinnerLoader from "../Common/Loading/SpinnerLoader";

const GatherHubPageClient: React.FC<GatherHubPageClientProps> = ({ initialData }) => {
  const {
    filteredMembers,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    setFilteredJob,
  } = useMemberData(initialData.members);

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = throttle(() => {
      // 사용자가 페이지 하단 근처로 스크롤할 경우 다음 페이지 데이터 요청
      if (hasNextPage && window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        void fetchNextPage();
      }
    }, 500); // 스크롤 이벤트 최적화 (500ms)

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 이벤트 제거
  }, [hasNextPage, fetchNextPage]);

  // 데이터 로딩 중 화면에 표시할 UI
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex justify-center items-center">
        <SpinnerLoader />
      </div>
    );
  }

  // 에러 발생 시 오류 메시지와 재시도 버튼 표시
  if (isError)
    return (
      <div className="text-center text-red-500">
        서버 오류: 데이터를 로드 중 문제가 발생했습니다.
        <button
          onClick={() => void refetch()}
          className="bg-red-500 text-white p-2 rounded-md mt-4"
        >
          다시 시도
        </button>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-4 py-8">
        {/* 작은 화면에서 JobDirectory (필터 기능) */}
        <JobDirectory setFilteredJob={setFilteredJob} className="mb-6 lg:hidden w-full" />

        {/* 멤버 리스트 컴포넌트 (무한스크롤 적용) */}
        <MemberList filteredMembers={filteredMembers} />

        {/* 큰 화면에서 JobDirectory (필터 기능) */}
        <JobDirectory setFilteredJob={setFilteredJob} className="hidden lg:block lg:ml-10 lg:w-40 mt-[-5px]" />
      </div>
    </div>
  );
};

export default GatherHubPageClient;