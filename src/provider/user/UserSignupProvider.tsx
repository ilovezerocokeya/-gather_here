/**
 * 회원가입 상태를 관리하는 Context 컴포넌트
 * - 회원가입 프로세스와 관련된 상태 및 로직을 관리
 * - 단계별로 회원가입 데이터를 업데이트하고 초기화
 */
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// 회원가입 상태 인터페이스
interface SignupState {
  step: number; // 현재 회원가입 단계
  job_title: string; // 직업 정보
  experience: string; // 경력 정보
  nickname: string; // 사용자 닉네임
  blog: string; // 블로그(포트폴리오) 링크
  profile_image_url: string; // 프로필 이미지 URL
  setField: (field: keyof SignupState, value: string | number) => void; // 특정 필드 업데이트 함수
  nextStep: () => void; // 다음 단계로 진행
  prevStep: () => void; // 이전 단계로 이동
  resetSignupUser: () => void; // 회원가입 상태 초기화
}

// Signup 상태를 공유하기 위한 Context 생성
const SignupContext = createContext<SignupState | undefined>(undefined);

// Signup 상태를 관리하는 Provider 컴포넌트
export const UserSignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 회원가입 상태 초기화
  const [step, setStep] = useState<number>(1);
  const [job_title, setJobTitle] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [blog, setBlog] = useState<string>("");
  const [profile_image_url, setProfileImageUrl] = useState<string>("");

  // 특정 필드 업데이트 함수
  const setField = useCallback(
    (field: keyof SignupState, value: string | number) => {
      switch (field) {
        case "step":
          setStep(value as number);
          break;
        case "job_title":
          setJobTitle(value as string);
          break;
        case "experience":
          setExperience(value as string);
          break;
        case "nickname":
          setNickname(value as string);
          break;
        case "blog":
          setBlog(value as string);
          break;
        case "profile_image_url":
          setProfileImageUrl(value as string);
          break;
        default:
          break;
      }
    },
    []
  );

  // 다음 단계로 진행
  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  // 이전 단계로 이동
  const prevStep = useCallback(() => setStep((prev) => Math.max(1, prev - 1)), []);

  // 회원가입 상태 초기화
  const resetSignupUser = useCallback(() => {
    setStep(1);
    setJobTitle("");
    setExperience("");
    setNickname("");
    setBlog("");
    setProfileImageUrl("");
  }, []);

  const contextValue: SignupState = {
    step,
    job_title,
    experience,
    nickname,
    blog,
    profile_image_url,
    setField,
    nextStep,
    prevStep,
    resetSignupUser,
  };

  return <SignupContext.Provider value={contextValue}>{children}</SignupContext.Provider>;
};

// Signup 상태를 쉽게 사용할 수 있는 커스텀 훅
export const useSignup = (): SignupState => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup는 UserSignupProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
