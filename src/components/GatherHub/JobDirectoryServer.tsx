import JobDirectoryClient from "./JobDirectoryClient";

interface JobDirectoryProps {
  initialJob: string;
}

const JobDirectoryServer = ({ initialJob }: JobDirectoryProps) => {
  return <JobDirectoryClient initialJob={initialJob} />;
};

export default JobDirectoryServer;