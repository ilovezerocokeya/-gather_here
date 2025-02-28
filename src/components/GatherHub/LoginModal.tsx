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
      <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={closeModal}></div>
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-[20px] p-6 z-50 shadow-xl">
        <button onClick={closeModal} className="absolute top-2 right-2 text-3xl text-gray-500 hover:text-gray-700">&times;</button>
        <div className="p-4">
          <h2 className="text-xl font-bold text-center mb-4">로그인</h2>
          <LoginForm />
        </div>
      </div>
    </>,
    document.body
  );
};

export default LoginModal;