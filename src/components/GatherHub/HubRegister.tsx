import React from 'react';
import { useRouter } from 'next/navigation';
import { HubRegisterProps } from '@/lib/gatherHub';

const HubRegister: React.FC<HubRegisterProps> = ({
  isAuthenticated,
  isHubRegistered,
  openLoginModal,
}) => {
  const router = useRouter();

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
        onClick={handleAddCard}
        className="fixed bottom-[40px] right-5 sm:right-10 w-12 h-12 sm:w-14 sm:h-14
                   bg-fillStrong text-primary text-lg rounded-2xl shadow-xl
                   transition-all duration-300 ease-out transform active:scale-95 cursor-pointer z-[9999]
                   animate-float md:animate-none md:hover:animate-bounce 
                   hover:bg-primary hover:text-black"
        style={{
          zIndex: 9999,
          userSelect: 'none',
          willChange: 'transform',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 sm:w-8 sm:h-8 m-auto"
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