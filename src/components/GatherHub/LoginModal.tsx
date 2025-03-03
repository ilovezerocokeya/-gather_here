import React from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { LoginModalProps } from '@/lib/gatherHub';

const LoginForm = dynamic(() => import('../Login/LoginForm'), { ssr: false });

const LoginModal: React.FC<LoginModalProps> = ({ isModalOpen, closeModal }) => {
  
  // 모달이 닫혀 있을 경우 렌더링하지 않음
  if (!isModalOpen) return null;

  return createPortal(
    <>
      {/* 모달 배경 */}
      <div className="fixed inset-0 bg-black bg-opacity-80 z-40" onClick={closeModal}></div>

      {/* 로그인 모달 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-background rounded-[20px] p-16 z-50 shadow-xl s:w-[340px] s:h-[450] w-[390px] h-[560px] flex flex-col items-center">
        {/* 닫기 버튼 */}
        <button onClick={closeModal} 
                className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-white transition"
        >
          &times;
        </button>

        {/* 로그인 폼 (배경 스타일 제거된 컴포넌트) */}
        <LoginForm />
      </div>
    </>,
    document.body
  );
};

export default LoginModal;