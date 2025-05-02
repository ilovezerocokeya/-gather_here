import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ProfileExtendProps } from '@/lib/gatherHub';
import { stripQuery } from "@/utils/Image/imageUtils"; 

const ProfileExtend: React.FC<ProfileExtendProps> = ({
  isOpen,
  closeModal,
  profileImageUrl,
  nickname,
  secureImageUrl,
  imageVersion
}) => {
  if (!isOpen) return null;

  // URL에서 쿼리 스트링 제거 후 버전 파라미터 추가
  const baseUrl = stripQuery(secureImageUrl(profileImageUrl));
  const versionedImageUrl = `${baseUrl}?v=${imageVersion ?? 0}`;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]"
      onClick={closeModal}
      style={{ userSelect: "none" }}
    >
      <div className="relative">
        <Image
          src={versionedImageUrl || "/assets/header/user.svg"}
          alt={nickname}
          width={500}
          height={500}
          quality={90}
          priority
          className="s:w-[340px] s:h-[340px] h-[500px] w-[500px] object-cover rounded-2xl shadow-lg"
        />
        <button
          className="absolute top-2 right-2 text-black text-2xl font-bold rounded-full p-2 hover:text-gray-800 hover:scale-110 transition-transform duration-200 ease-in-out"
          onClick={closeModal}
          style={{ userSelect: "none" }}
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ProfileExtend;