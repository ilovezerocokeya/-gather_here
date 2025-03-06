import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ProfileExtendProps } from '@/lib/gatherHub';

const ProfileExtend: React.FC<ProfileExtendProps> = ({
  isOpen,
  closeModal,
  profileImageUrl,
  nickname,
  secureImageUrl,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]"
      onClick={closeModal}
      style={{ userSelect: "none" }}
    >
      <div className="relative">
        <Image
          src={secureImageUrl(profileImageUrl) || "/assets/header/user.svg"} 
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