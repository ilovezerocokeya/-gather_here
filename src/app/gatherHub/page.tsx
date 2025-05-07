export const revalidate = 10;

import { fetchMembers } from "@/utils/fetchMembers";
import GatherHubPageClient from "@/components/GatherHub/GatherHubClientPage";

// SSR을 위해 서버에서 미리 데이터 불러오기
const getMembersForSSR = async () => {
  const { members, nextPage } = await fetchMembers(1);
  return { members, nextPage };
};

// SSR 데이터를 props로 전달
const GatherHubPage = async () => {
  const initialData = await getMembersForSSR();
  return <GatherHubPageClient initialData={initialData} />;
};

export default GatherHubPage;