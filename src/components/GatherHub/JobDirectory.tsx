"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/provider/UserContextProvider';
import LoginForm from '../Login/LoginForm';

interface JobDirectoryProps {
  setFilteredJob: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const jobCategories = [
  { name: '전체 보기', value: 'all', hoverClass: 'hover:bg-primary hover:text-black' },
  { name: '프론트엔드', value: 'frontend', hoverClass: 'hover:bg-primaryStrong hover:text-black' },
  { name: '백엔드', value: 'backend', hoverClass: 'hover:bg-accentOrange hover:text-black' },
  { name: 'iOS', value: 'ios', hoverClass: 'hover:bg-accentMaya hover:text-black' },
  { name: '안드로이드', value: 'android', hoverClass: 'hover:bg-accentPurple hover:text-black' },
  { name: '데브옵스', value: 'devops', hoverClass: 'hover:bg-accentRed hover:text-black' },
  { name: '디자인', value: 'design', hoverClass: 'hover:bg-accentMint hover:text-black' },
  { name: 'PM', value: 'pm', hoverClass: 'hover:bg-accentColumbia hover:text-black' },
  { name: '기획', value: 'planning', hoverClass: 'hover:bg-accentPink hover:text-black' },
  { name: '마케팅', value: 'marketing', hoverClass: 'hover:bg-accentYellow hover:text-black' },
];

const JobDirectory: React.FC<JobDirectoryProps> = ({ setFilteredJob, className }) => {
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const router = useRouter();
  const { isAuthenticated, userData } = useUser(); // 유저 정보와 인증 상태를 가져옴
  const [isHubRegistered, setIsHubRegistered] = useState(false); // Hub 등록 여부 상태
  const [isLoginModalOpen, setLoginModalOpen] = useState(false); // 로그인 모달 상태

  useEffect(() => {
    // 유저의 Hub 등록 여부 확인
    if (userData && userData.hubCard) {
      setIsHubRegistered(true); // 유저가 이미 Hub에 카드를 등록한 경우
    }
  }, [userData]);

  const handleSelectJob = (jobValue: string) => {
    setSelectedJob(jobValue);
    setFilteredJob(jobValue);
  };

  const handleAddCard = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true); // 로그인이 안 되어있으면 로그인 모달 열기
    } else {
      // Hub 등록 여부에 따라 페이지 이동
      if (isHubRegistered) {
        router.push('/mypage/'); 
      } else {
        router.push('/mypage'); 
      }
    }
  };

  const handleCloseModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <aside className={`${className} p-4 rounded-lg sticky top-4`}>
       {/* 작은 화면에서는 버튼을 위로 이동 */}
       <div className="lg:hidden">
          <button
          className="mb-4 w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-2 text-lg rounded-lg shadow-lg hover:from-purple-600 hover:to-green-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
          onClick={handleAddCard}
          >
          Hub 등록하기
          </button>
      </div>
      {/* 큰 화면에서 리스트로, 작은 화면에서는 셀렉트 박스로 */}
      <div className="block lg:hidden">
        <select
          className="p-2 text-lg bg-black text-white rounded-lg w-full"
          value={selectedJob}
          onChange={(e) => handleSelectJob(e.target.value)}
        >
          {jobCategories.map((job) => (
            <option key={job.value} value={job.value}>
              {job.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="hidden lg:block job-list">
        {jobCategories.map((job) => (
          <li
          key={job.value}
          className={`job-item 
          ${selectedJob === job.value ? 'bg-primary text-black font-bold' : ''} 
          ${job.hoverClass} text-center rounded-lg p-2 transition-all duration-300`}  // 호버 시 폰트 두껍게
          onClick={() => handleSelectJob(job.value)}
        >
          {job.name}
        </li>
        ))}
      </ul>

{/* Hub 등록 버튼 (큰 화면용) */}
<div className="hidden lg:block">
  <button
    className="mt-10 w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-3 rounded-lg shadow-lg hover:from-purple-600 hover:to-green-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
    onClick={handleAddCard}
  >
    {isHubRegistered ? 'Hub 수정하기' : 'Hub 등록하기'}
  </button>
</div>

      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-background p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 모달 닫히지 않음
          >
            <button
              className="absolute top-2 right-2 text-gray-400 font-bold rounded-full p-2 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out shadow-lg"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <LoginForm />
          </div>
        </div>
      )}
    </aside>
  );
};

export default JobDirectory;