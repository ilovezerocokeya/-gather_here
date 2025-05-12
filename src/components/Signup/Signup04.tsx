"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/provider/ContextProvider";
import { useUserStore } from "@/stores/useUserStore";
import Image from "next/image";

const Signup04: React.FC = () => {
  const router = useRouter();
  const { userData } = useUserStore(); // 전역 상태에서 유저 정보 조회
  const nickname = userData?.nickname ?? "";
  const { closeModal } = useModal();

  // "둘러보기" 버튼 클릭 시 홈으로 이동
  const handleExplore = () => {
    closeModal(); // 모달 닫기 (혹시 열려있을 수 있으므로 방어)
    router.replace("/"); // 홈으로 리디렉션
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50" style={{ marginTop: '-30px' }}>
      <div className="...">
        {/* 환영 이미지 */}
        <div className="...">
          <Image
            src="/logos/welcome.webp"
            alt="Welcome Image"
            width={350}
            height={350}
            className="object-contain s:w-[300px] s:h-[300px]"
          />
        </div>

        {/* 환영 메시지 */}
        <div className="text-center s:mt-6 mt-10">
          <div className="text-2xl font-medium text-white">환영해요!</div>
          <div className="text-[#9a9a9a] mt-5 text-m">
            <span className="text-[#c3e88d]">{nickname}</span>님이 @gather_here에서
            <br /> 더 많은 경험을 할 수 있도록 도울게요
          </div>
        </div>

        {/* 둘러보기 버튼 */}
        <div className="s:bottom-8 bottom-9 w-full px-4 mt-10 flex justify-center">
          <button
            onClick={handleExplore}
            className="s:w-[300px] w-[350px] h-[45px] bg-[#343437] text-primary py-2 rounded-md transition-transform hover:scale-105 hover:text-white active:scale-95"
          >
            둘러보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup04;