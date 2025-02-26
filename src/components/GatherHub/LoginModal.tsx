import React from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { LoginModalProps } from '@/lib/gatherHub';

const LoginForm = dynamic(() => import('../Login/LoginForm'), { ssr: false });

const LoginModal: React.FC<LoginModalProps> = ({ isModalOpen, closeModal }) => {
    
  // 모달이 닫힌 상태라면 아무것도 렌더링하지 않음
  if (!isModalOpen) return null;

  return createPortal(
    <>
      {/* 모달 배경 (클릭 시 닫힘) */}
      <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={closeModal}></div>
      
      {/* 로그인 폼이 포함된 모달 창 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl p-4 z-50">
        {/* 닫기 버튼 */}
        <button onClick={closeModal} className="text-3xl">&times;</button>
        
        {/* 로그인 폼 */}
        <LoginForm />
      </div>
    </>,
    document.body
  );
};

export default LoginModal;