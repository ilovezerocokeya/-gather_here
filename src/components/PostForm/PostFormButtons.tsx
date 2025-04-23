'use client';

import React from 'react';
import Image from 'next/image';

interface PostFormButtonsProps {
  onExit: () => void;
  onSaveDraft: () => void;
  mode?: 'create' | 'edit'; // default: create
}

const PostFormButtons = ({
  onExit,
  onSaveDraft,
  mode = 'create',
}: PostFormButtonsProps) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        type="button"
        onClick={onExit}
        className="text-labelNeutral flex items-center space-x-2 transition hover:text-primary active:scale-95"
      >
        <Image src="/assets/back.svg" alt="Back" width={24} height={24} />
        <span className="font-medium">나가기</span>
      </button>
      <div className="flex space-x-4">
        <button type="button" className="shared-button-gray" onClick={onSaveDraft}>
          임시 저장
        </button>
        <button
          type="submit"
          className="shared-button-green transition-all duration-150 hover:brightness-110 active:scale-95"
        >
          {mode === 'edit' ? '수정 완료' : '등록'}
        </button>
      </div>
    </div>
  );
};

export default PostFormButtons;