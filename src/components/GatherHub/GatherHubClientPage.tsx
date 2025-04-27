"use client";

import MemberList from "./MemberList";
import JobDirectory from "@/components/GatherHub/JobDirectory";
import { useMemberData } from "@/hooks/useMemberData";
import { GatherHubPageClientProps } from "@/lib/gatherHub";
import SpinnerLoader from "../Common/Loading/SpinnerLoader";

const GatherHubPageClient: React.FC<GatherHubPageClientProps> = ({ initialData }) => {
  if (!initialData?.members) {
    return (
      <div className="text-center text-red-500 py-10">
        서버로부터 초기 데이터를 불러오지 못했습니다.
      </div>
    );
  }

  const {
    filteredMembers,
    isLoading,
    isError,
    refetch,
    setFilteredJob,
  } = useMemberData(initialData.members);

  // 데이터 로딩 중 화면에 표시할 UI
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex justify-center items-center">
        <SpinnerLoader />
      </div>
    );
  }

  // 에러 발생 시 오류 메시지와 재시도 버튼 표시
  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        서버 오류: 데이터를 로드 중 문제가 발생했습니다.
        <button
          onClick={() => void refetch()}
          className="bg-red-500 text-white p-2 rounded-md mt-4"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-4 py-8">
        {/* 작은 화면에서 JobDirectory (필터 기능) */}
        <JobDirectory setFilteredJob={setFilteredJob} className="mb-6 lg:hidden w-full" />

        {/* 멤버 리스트 컴포넌트 */}
        <MemberList filteredMembers={filteredMembers} />

        {/* 큰 화면에서 JobDirectory (필터 기능) */}
        <JobDirectory setFilteredJob={setFilteredJob} className="hidden lg:block lg:ml-10 lg:w-40 mt-[-5px]" />
      </div>
    </div>
  );
};

export default GatherHubPageClient;