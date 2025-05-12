export const revalidate = 10;

import { fetchMembers } from "@/utils/fetchMembers";
import GatherHubPageClient from "@/components/GatherHub/GatherHubClientPage";

// 1페이지 멤버 데이터 SSR로 사전 요청
const getMembersForSSR = async () => {
  const { members, nextPage } = await fetchMembers(1);
  return { members, nextPage };
};

// 초기 데이터 props로 클라이언트 컴포넌트에 전달
const GatherHubPage = async () => {
  const initialData = await getMembersForSSR();
  return <GatherHubPageClient initialData={initialData} />;
};

export default GatherHubPage;