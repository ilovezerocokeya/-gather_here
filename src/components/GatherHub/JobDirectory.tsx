import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/provider/user/UserAuthProvider';
import { useUserData } from '@/provider/user/UserDataProvider';
import JobFilter from './JobFilter';
import HubRegister from './HubRegister';
import LoginModal from './LoginModal';
import { JobDirectoryProps } from '@/lib/gatherHub'; 

const JobDirectory: React.FC<JobDirectoryProps> = ({ setFilteredJob, className }) => {
  // 로컬 스토리지에서 저장된 직업 선택 값을 불러오거나 기본값으로 all
  const [selectedJob, setSelectedJob] = useState<string>(() => localStorage.getItem('selectedJob') || 'all');

  // 사용자 인증 정보 및 사용자 데이터 가져오기
  const { isAuthenticated } = useAuth();
  const { userData } = useUserData();

  // Hub 등록 여부를 useMemo로 캐싱 
  const isHubRegistered = useMemo(() => userData?.hubCard || false, [userData]);

  // 직업군 리스트
  const jobCategories = useMemo(() => [
    { name: '전체보기', value: 'all', hoverClass: 'hover:bg-primary hover:text-black' },
    { name: '프론트엔드', value: '프론트엔드', hoverClass: 'hover:bg-primaryStrong hover:text-black' },
    { name: '백엔드', value: '백엔드', hoverClass: 'hover:bg-accentOrange hover:text-black' },
    { name: 'IOS', value: 'IOS', hoverClass: 'hover:bg-accentMaya hover:text-black' },
    { name: '안드로이드', value: '안드로이드', hoverClass: 'hover:bg-accentPurple hover:text-black' },
    { name: '데브옵스', value: '데브옵스', hoverClass: 'hover:bg-accentRed hover:text-black' },
    { name: '디자인', value: '디자인', hoverClass: 'hover:bg-accentMint hover:text-black' },
    { name: 'PM', value: 'PM', hoverClass: 'hover:bg-accentColumbia hover:text-black' },
    { name: '기획', value: '기획', hoverClass: 'hover:bg-accentPink hover:text-black' },
    { name: '마케팅', value: '마케팅', hoverClass: 'hover:bg-accentYellow hover:text-black' }
  ], []);

  // 직업군 선택 핸들러
  const handleSelectJob = useCallback((jobValue: string) => {
    setSelectedJob(jobValue);
    setFilteredJob(jobValue);
    localStorage.setItem('selectedJob', jobValue);
  }, [setFilteredJob]);

  // 로그인 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 로그인 모달 열기
  const openLoginModal = () => setIsModalOpen(true);
  
  // 로그인 모달 닫기
  const closeLoginModal = () => setIsModalOpen(false);

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