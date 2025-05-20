import { fetchMembers } from "@/utils/fetchMembers";
import MemberListServer from "./MemberListServer";
import JobDirectoryServer from "./JobDirectoryServer";
import Pagination from "./Pagination";

export interface GatherHubPageParams {
  searchParams: { page?: string; job?: string };
}

const GatherHubPage = async ({ searchParams }: GatherHubPageParams) => {
  const currentPage = Number(searchParams.page) || 1;
  const selectedJob = searchParams.job ?? "all";
  const { members, totalPages } = await fetchMembers(currentPage, selectedJob);

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-16 py-1">
        {/* 모바일 필터 */}
        <div className="mb-6 lg:hidden w-full sticky s:mt-4 top-12 z-20">
          <JobDirectoryServer initialJob={selectedJob} />
        </div>
  
        {/* 멤버 카드 + 페이지네이션 */}
        <div className="w-full flex flex-col">
          <MemberListServer members={members} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
  
        {/* 데스크탑 필터 */}
        <div className="hidden lg:block lg:ml-20 lg:w-40 shrink-0 mt-[24px]">
          <JobDirectoryServer initialJob={selectedJob} />
        </div>
      </div>
    </div>
  );
};

export default GatherHubPage;