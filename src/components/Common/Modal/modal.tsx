'use client';

import LoginForm from '@/components/Login/LoginForm';
import { useLoginModalStore } from '@/stores/useLoginModalStore';

const LoginModal = () => {
  const { isOpen, closeModal } = useLoginModalStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={closeModal}></div>
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-[20px] p-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="ml-auto mt-1 mr-1 block text-right p-1 text-3xl text-[fontWhite] hover:text-[#777]"
          onClick={closeModal}
        >
          &times;
        </button>
        <LoginForm />
      </div>
    </>
  );
};

export default LoginModal;