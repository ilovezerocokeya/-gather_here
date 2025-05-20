import GatherHubPage from "@/components/GatherHub/GatherHubPage";
import { GatherHubPageParams } from "@/components/GatherHub/GatherHubPage"; // 혹은 직접 선언해도 OK

const HubPage = (props: GatherHubPageParams) => {
  return <GatherHubPage {...props} />;
};

export default HubPage;