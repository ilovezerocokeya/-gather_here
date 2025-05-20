'use client';

import { useState } from 'react';
import CardModalClient from './CardModalClient';
import { MemberType } from '@/lib/gatherHub';

interface CardModalShellProps extends MemberType {
  imageVersion: number;
  triggerNode?: React.ReactNode; // 클릭 시 사용할 트리거 (선택사항)
}

const CardModalShell = ({
  triggerNode,
  imageVersion,
  ...memberProps
}: CardModalShellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {triggerNode && (
        <div onClick={openModal}>
          {triggerNode}
        </div>
      )}

      <CardModalClient
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        imageVersion={imageVersion}
        {...memberProps}
      />
    </>
  );
};

export default CardModalShell;