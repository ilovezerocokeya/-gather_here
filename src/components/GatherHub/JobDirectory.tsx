import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/provider/user/UserAuthProvider';
import { useUserStore } from '@/stores/useUserStore';
import JobFilter from './JobFilter';
import HubRegister from './HubRegister';
import LoginModal from './LoginModal';
import { JobDirectoryProps, jobCategories } from '@/lib/gatherHub'; 

const JobDirectory: React.FC<JobDirectoryProps> = ({ setFilteredJob, className }) => {

  const { isAuthenticated } = useAuth(); 
  const { userData } = useUserStore();
  const [selectedJob, setSelectedJob] = useState<string>(() => localStorage.getItem('selectedJob') ?? 'all');
  const isHubRegistered = useMemo(() => userData?.hubCard ?? false, [userData]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openLoginModal = () => setIsModalOpen(true);
  const closeLoginModal = () => setIsModalOpen(false);

  // 직업군 선택 핸들러
  const handleSelectJob = useCallback((jobValue: string) => {
    setSelectedJob(jobValue);
    setFilteredJob(jobValue);
    localStorage.setItem('selectedJob', jobValue);
  }, [setFilteredJob]);

  return (
      <aside className={`${className} p-1 rounded-lg relative user-select-none`} style={{ userSelect: 'none' }}>
      {/* 직업 필터링 UI */}
      <JobFilter selectedJob={selectedJob} handleSelectJob={handleSelectJob} jobCategories={jobCategories} />
      
      {/* Hub 등록 버튼 */}
      <HubRegister isAuthenticated={isAuthenticated} isHubRegistered={isHubRegistered} openLoginModal={openLoginModal} />
      
      {/* 로그인 모달 */}
      <LoginModal isModalOpen={isModalOpen} closeModal={closeLoginModal} />
    </aside>
  );
};

export default JobDirectory;