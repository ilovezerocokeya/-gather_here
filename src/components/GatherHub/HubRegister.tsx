import React from 'react';
import { useRouter } from 'next/navigation';
import { HubRegisterProps } from '@/lib/gatherHub';

const HubRegister: React.FC<HubRegisterProps> = ({ isAuthenticated, isHubRegistered, openLoginModal }) => {
  const router = useRouter();
  
   // 버튼 클릭 시 실행되는 함수
   const handleAddCard = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      router.push(isHubRegistered ? '/mypage/' : '/mypage'); 
    }
  };

  return (
    <div className="relative group">
      <button
        aria-label="로그인 모달 or 마이페이지 이동 버튼"
        className="fixed bottom-[40px] right-5 sm:right-10 w-12 h-12 sm:w-14 sm:h-14 bg-fillStrong text-primary text-lg 
                  rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-out 
                  hover:scale-110 active:scale-95 hover:animate-bounce hover:bg-fillLight cursor-pointer z-[9999]"
        onClick={handleAddCard}
        style={{
          zIndex: 9999,
          userSelect: 'none',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 sm:w-8 sm:h-8 m-auto text-bright"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
};

export default HubRegister;
