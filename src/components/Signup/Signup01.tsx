"use client";

import React, { useState } from "react";
import JobSelectionButton from "./components/JobSelectionButton";
import SkipButton from "./components/SkipButton";
import useSelectJob from "@/hooks/useSelectJob";
import { useRouter } from "next/navigation";
import { useModal } from "@/provider/ContextProvider";
import AlertModal from "./components/AlertModal";


const job_titles = ["프론트엔드", "백엔드", "IOS", "안드로이드", "데브옵스", "기획자", "디자이너", "마케터", "PM"]; // 선택 가능한 직무 리스트

// 직무에 따라 버튼 스타일 클래스 지정
const jobClasses: Record<string, string> = {
  프론트엔드: "button-frontend",
  백엔드: "button-backend",
  IOS: "button-ios",
  안드로이드: "button-android",
  데브옵스: "button-devops",
  기획: "button-planner",
  디자이너: "button-designer",
  마케터: "button-marketer",
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
        <SkipButton onSkip={handleSkipWithConfirmation} />
        <div className="absolute left-1/2 transform -translate-x-1/2 top-4 flex space-x-2">
          <div className="w-[136px] s:h-18 h-20 justify-start items-center gap-2 inline-flex">
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#c3e88d] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="self-stretch text-center text-[#c3e88d] text-sm font-medium leading-[21px]">1</div>
            </div>
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium leading-[21px]">2</div>
            </div>
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium leading-[21px]">3</div>
            </div>
          </div>
        </div>
        <div className="text-center text-2xl font-medium text-[#ffffff] leading-9 s:mt-18 mt-20">
          어떤 일을 하고 계신가요?
        </div>
        <div className="text-center text-[#9a9a9a] mt-2">
          직무와 관련된 스터디 및 프로젝트, <br /> 다양한 IT행사를 추천해 드려요.
        </div>
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

        {/* 모달 컴포넌트 */}
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