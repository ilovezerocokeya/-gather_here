import React from 'react';
import { useRouter } from 'next/navigation';
import { HubRegisterProps } from '@/lib/gatherHub';

const HubRegister: React.FC<HubRegisterProps> = ({ isAuthenticated, isHubRegistered, openLoginModal }) => {
  const router = useRouter();
  const handleAddCard = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      router.push(isHubRegistered ? '/mypage/' : '/mypage');
    }
  };

  return (
    <button className="fixed bottom-10 right-5 w-14 h-14 bg-fillStrong text-primary rounded-2xl" onClick={handleAddCard}>
      +
    </button>
  );
};

export default HubRegister;