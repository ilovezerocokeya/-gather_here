"use client";

import React, { useEffect, useRef, useState } from "react"; 
import { useForm, SubmitHandler } from "react-hook-form";
import NicknameInput from "@/components/Signup/components/NicknameInput";
import BlogInput from "@/components/Signup/components/BlogInput";
import useCheckNickname from "@/hooks/useCheckNickname";
import useSubmitProfile from "@/hooks/useSubmitProfile"; 
import CustomModal from "./components/CustomModal"; 
import { useUser } from "@/provider/UserContextProvider"; 
import { useModal } from "@/provider/ContextProvider"; 

// 폼 데이터의 타입 정의
export interface FormValues {
  nickname: string; 
  blog?: string;
}

interface Signup03Type {
  setUserData: (data: any) => void; // 사용자 데이터를 설정하는 함수
}

// 회원가입 3단계 컴포넌트
const Signup03: React.FC<Signup03Type> = ({ setUserData }) => {
  const { prevStep } = useUser();
  const { closeModal } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 오픈 상태 관리
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }, 
    setError,
  } = useForm<FormValues>(); // react-hook-form 훅을 사용하여 폼 초기화

  const watchNickname = watch("nickname"); // 닉네임 필드 감시
  const formRef = useRef<HTMLFormElement>(null); // 폼 요소에 대한 참조를 저장하는 useRef 훅을 사용하여 초기값을 null로 설정
  const nicknameAvailable = useCheckNickname(watchNickname); // 닉네임 사용 가능 여부 확인 훅
  const { onSubmit, blogError, blogSuccess, setBlogError, setBlogSuccess, validateUrl } = useSubmitProfile(setUserData); // 프로필 제출 훅

  // handleSubmit과 맞는 함수로 재정의한 onSubmitForm
  const onSubmitForm: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (nicknameAvailable === false) {
      setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
      return;
    }

    await onSubmit(data, nicknameAvailable, setError); // 기존 onSubmit 호출
  };

  // 폼 제출 핸들러
  const handleFormSubmit = (data: FormValues) => {
    document.body.classList.remove("page-disabled"); // 페이지 비활성화 클래스 제거

    // 블로그 URL이 비어있는 경우 경고 모달 표시
    if (!data.blog || data.blog.trim() === "") {
      setIsModalOpen(true); // 모달을 열기 위한 상태 설정
    } else {
      onSubmitForm(data); // 블로그 URL이 있을 경우 데이터 제출
    }
  };

  const handleConfirmSkip = () => {
    // 모달에서 "네, 저장하기" 선택 시 처리
    setIsModalOpen(false);
    document.body.classList.remove("page-disabled");
    handleSubmit(onSubmitForm)(); // handleSubmit 함수와 연결된 onSubmitForm 실행
  };

  const handleCancelSkip = () => {
    // 모달에서 "아니요, 다시 입력하기" 선택 시 처리
    setIsModalOpen(false); // 모달 닫기
    document.body.classList.add("page-disabled"); // 페이지 비활성화
  };

  useEffect(() => {
    console.log(`
      .d8888888b.                        888    888                                888
     d88P"   "Y88b                       888    888                                888
     888  d8b  888                       888    888                                888
     888  888  888      .d88b.   8888b.  888888 88888b.   .d88b.  888d888          88888b.   .d88b.  888d888  .d88b.
     888  888bd88P     d88P"88b     "88b 888    888 "88b d8P  Y8b 888P"            888 "88b d8P  Y8b 888P"   d8P  Y8b
     888  Y8888P"      888  888 .d888888 888    888  888 88888888 888              888  888 88888888 888     88888888
     Y88b.     .d8     Y88b 888 888  888 Y88b. 888  888 Y8b.     888              888  888 Y8b.     888     Y8b.
      "Y88888888P"      "Y88888 "Y888888  "Y888 888  888  "Y8888  888     88888888 888  888  "Y8888  888      "Y8888
                            888
                       Y8b d88P
                        "Y88P"
       `);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50" style={{ marginTop: '-30px' }}>
      <div className="s:w-[370px] s:h-[580px] w-[430px] h-[610px] relative bg-background rounded-[20px] p-4 select-none border border-background shadow-lg">
        {prevStep && (
          <button onClick={prevStep} className="absolute left-9 top-10 text-[c4c4c4]">
            &larr;
          </button>
        )}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-4 flex space-x-2">
          <div className="w-[136px] s:h-18 h-20 justify-start items-center gap-2 inline-flex">
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium leading-[21px]">1</div>
            </div>
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium leading-[21px]">2</div>
            </div>
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#c3e88d] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="self-stretch text-center text-[#c3e88d] text-sm font-medium leading-[21px]">3</div>
            </div>
          </div>
        </div>
  
        <div className="text-center text-2xl font-medium text-[#ffffff] leading-9 mt-20">
          거의 다 왔어요!
        </div>
        <div className="text-center text-[#9a9a9a] s:mt-1 mt-3">
          자신을 나타낼 수 있는 포트폴리오 링크를 알려주시면 <br className="s:hidden" /> 함께 할 동료를 만나는 데 큰 도움이 될거예요.
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="max-h-[380px] overflow-y-auto s:mt-6 mt-1">
          <NicknameInput register={register} errors={errors} nicknameAvailable={nicknameAvailable} watch={watch} />
          <BlogInput
            register={register}
            watch={watch}
            blogError={blogError}
            blogSuccess={blogSuccess}
            setBlogError={setBlogError}
            setBlogSuccess={setBlogSuccess}
            validateUrl={validateUrl}
          />
          <div className="flex justify-center items-center s:mt-10 mt-8">
            <button
              type="submit"
              className={`s:w-[300px] w-[350px] h-[45px] py-3 flex justify-center items-center rounded-md transition-transform transform hover:scale-105 active:scale-95 active:bg-gray-800 active:text-gray-200 ${
                watchNickname && watchNickname.trim() !== ""
                  ? "bg-[#C3E88D] text-[#343437] hover:bg-[#C3E88D] hover:text-[#343437]"
                  : "bg-[#343437] text-[#FFFFFF]"
              }`}
            >
              프로필 저장하기
            </button>
          </div>
        </form>
        
        {/* 모달 구현 */}
        {isModalOpen && (
          <CustomModal
            isOpen={isModalOpen}
            onCancel={handleCancelSkip}
            onConfirm={handleConfirmSkip}
          />
        )}
      </div>
    </div>
  );
};

export default Signup03;