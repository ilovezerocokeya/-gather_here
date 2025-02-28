import React from 'react';
import { useRouter } from 'next/navigation';
import { HubRegisterProps } from '@/lib/gatherHub';

const HubRegister: React.FC<HubRegisterProps> = ({ isAuthenticated, isHubRegistered, openLoginModal }) => {
  const router = useRouter();
  
   // 버튼 클릭 시 실행되는 함수
   const handleAddCard = () => {
    if (!isAuthenticated) {
      // 로그인하지 않은 경우, 로그인 모달 열기
      openLoginModal();
    } else {
      // 이미 Hub에 등록한 경우 "/mypage/"로 이동, 아니면 "/mypage"로 이동
      router.push(isHubRegistered ? '/mypage/' : '/mypage');
    }
  };

  return (
    <div className="fixed bottom-10 right-5 group">
      <button className="w-14 h-14 bg-fillStrong text-primary rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-110" onClick={handleAddCard}>
        +
      </button>
      <div className="absolute bottom-16 right-0 w-max px-3 py-2 bg-yellow-500 text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
        Hub멤버가 되기 위해 카드를 등록해주세요
        <div className="absolute bottom-[-8px] right-2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45"></div>
      </div>
    </div>
  );
};

export default HubRegister;
