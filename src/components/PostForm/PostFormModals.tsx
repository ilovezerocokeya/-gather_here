'use client';

import React from 'react';
import CommonModal from '@/components/Common/Modal/CommonModal';
import LoginForm from '@/components/Login/LoginForm';

interface PostFormModalsProps {
  showLoginModal: boolean;
  setShowLoginModal: (open: boolean) => void;
  showExitModal: boolean;
  setShowExitModal: (open: boolean) => void;
  onExitConfirm: () => void;
}

const PostFormModals = ({
  showLoginModal,
  setShowLoginModal,
  showExitModal,
  setShowExitModal,
  onExitConfirm,
}: PostFormModalsProps) => {
  return (
    <>
      <CommonModal isOpen={showLoginModal} onRequestClose={() => setShowLoginModal(false)}>
        <LoginForm />
      </CommonModal>

      <CommonModal isOpen={showExitModal} onRequestClose={() => setShowExitModal(false)}>
        <div className="p-6 text-center bg-fillStrong rounded-xl shadow-lg">
          <p className="text-lg font-semibold text-white mb-2">작성 중인 내용이 있어요.</p>
          <p className="text-sm text-labelNeutral mb-6">
            작성을 종료하면 저장되지 않아요. 종료할까요?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowExitModal(false)}
              className="px-4 py-2 rounded-lg bg-fillNeutral text-primary hover:bg-opacity-80 transition"
            >
              마저 쓸래요
            </button>
            <button
              onClick={onExitConfirm}
              className="px-4 py-2 rounded-lg bg-primary text-fillNeutral hover:bg-opacity-90 transition"
            >
              나갈래요
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default PostFormModals;