"use client";

import React, { useState } from "react";
import JobSelectionButton from "./components/JobSelectionButton";
import SkipButton from "./components/SkipButton";
import useSelectJob from "@/hooks/useSelectJob";
import { useRouter } from "next/navigation";
import { useModal } from "@/provider/ContextProvider";
import AlertModal from "./components/AlertModal";


const job_titles = ["프론트엔드", "백엔드", "IOS", "안드로이드", "데브옵스", "기획", "디자인", "마케팅", "PM"]; // 선택 가능한 직무 리스트

// 직무에 따라 버튼 스타일 클래스 지정
const jobClasses: Record<string, string> = {
  프론트엔드: "button-frontend",
  백엔드: "button-backend",
  IOS: "button-ios",
  안드로이드: "button-android",
  데브옵스: "button-devops",
  기획: "button-planner",
  디자인: "button-designer",
  마케팅: "button-marketer",
  PM: "button-pm",
};

const Signup01: React.FC = () => {
  const { selectedJob, handleJobSelection } = useSelectJob(); // 직무 선택 상태 및 핸들러
  const router = useRouter(); // 페이지 이동용
  const { closeModal } = useModal(); // 모달 제어용 context
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // 건너뛰기 버튼 클릭 시 모달 오픈
  const handleSkipWithConfirmation = () => {
    setIsModalOpen(true);
  };

  // 모달에서 건너뛰기 확인 시 홈으로 이동
  const handleConfirmSkip = () => {
    closeModal();
    router.replace("/"); // 홈으로 이동
  };

  // 모달에서 취소 시 모달 닫기
  const handleCancelSkip = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50" style={{ marginTop: '-30px' }}>
      <div className="s:w-[370px] s:h-[580px] w-[430px] h-[610px] relative bg-background rounded-[20px] p-4 select-none border border-background shadow-lg">
        
        {/* 건너뛰기 버튼 */}
        <SkipButton onSkip={handleSkipWithConfirmation} />

        {/* 직무 선택 버튼들 */}
        <div className="grid grid-cols-3 gap-1 s:mt-4 mt-6 s:w-[335px] w-[370px] h-[365px] s:h-[335px] mx-auto">
          {job_titles.map((job) => (
            <JobSelectionButton
              key={job}
              job={job}
              isSelected={selectedJob === job}
              onSelect={handleJobSelection}
              className={`square-button ${jobClasses[job]} bg-[#343437] text-[#c4c4c4]`}
            />
          ))}
        </div>

        {/* 건너뛰기 시 모달 */}
        {isModalOpen && (
          <AlertModal
            isOpen={isModalOpen}
            onConfirm={handleConfirmSkip}
            onCancel={handleCancelSkip}
          />
        )}
      </div>
    </div>
  );
};

export default Signup01;