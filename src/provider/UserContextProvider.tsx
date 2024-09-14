"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSignupForm } from "@/hooks/useSignupForm";
import { useUserData } from "@/hooks/useUserData";
import { User } from "@supabase/supabase-js";

// UserContextType 인터페이스에 추가로 필요한 상태와 메서드를 정의
// Context API에서 전역으로 사용할 사용자 관련 상태 및 함수들의 타입을 정의
interface UserContextType {
  user: User | null;
  userData: any;
  step: number;
  job_title: string;
  experience: string;
  nickname: string;
  blog: string;
  profile_image_url: string;
  setUserData: (data: any) => void;
  fetchUserData: () => Promise<void>;
  loading: boolean;
  initializationUser: () => void;
  setJob: (job: string) => void;
  updateField: (field: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSignupUser: () => void;
  resetAuthUser: () => void;
  setNickname: (nickname: string) => void;
  setBlog: (blog: string) => void;
  setUser: (user: User | null) => void;
  setProfileImageUrl: (url: string) => void;
}

// 기본값으로 사용될 상태 초기화
// UserContext의 초기값을 설정 (빈 값 또는 함수)
export const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  step: 1,
  job_title: "",
  experience: "",
  nickname: "",
  blog: "",
  profile_image_url: "",
  setUserData: () => {},
  fetchUserData: async () => {},
  loading: true,
  initializationUser: () => {},
  setJob: () => {},
  updateField: () => {},
  nextStep: () => {},
  prevStep: () => {},
  resetSignupUser: () => {},
  resetAuthUser: () => {},
  setNickname: () => {},
  setBlog: () => {},
  setUser: () => {},
  setProfileImageUrl: () => {},
});

// UserProvider 컴포넌트: 전역 상태를 관리하고 하위 컴포넌트들에게 UserContext를 제공
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 
  // useUserData 훅을 사용하여 사용자 상태와 관련된 데이터를 가져옴 (Supabase에서 데이터를 가져옵니다)
  const {
    user,
    setUser,
    userData,
    loading,
    setUserData,
    fetchUserAndData,
    initializationUser,
  } = useUserData();

  // useSignupForm 훅을 사용하여 회원가입 폼 관련 상태를 관리
  const {
    step,
    job_title,
    experience,
    nickname,
    blog,
    profile_image_url,
    setJobTitle,
    updateField,
    nextStep,
    prevStep,
    resetSignupUser,
  } = useSignupForm();

  // 닉네임을 설정하는 함수. `setUserData`를 사용해 `userData`에 닉네임을 저장합니다.
  const setNickname = (nickname: string) => {
    setUserData((prevData: any) => ({ ...prevData, nickname }));
  };

  // 블로그 URL을 설정하는 함수. `setUserData`를 사용해 `userData`에 블로그 URL을 저장합니다.
  const setBlog = (blog: string) => {
    setUserData((prevData: any) => ({ ...prevData, blog }));
  };

  // 사용자를 설정하는 함수. 로그인 시 사용됩니다.
  const setUserFn = (newUser: User | null) => {
    setUser(newUser);
  };

   // 프로필 이미지 URL을 설정하는 함수. 사용자 데이터를 업데이트합니다.
  const setProfileImageUrl = (url: string) => {
    setUserData((prevData: any) => ({ ...prevData, profile_image_url: url }));
  };

 // 사용자 인증 상태를 초기화하고 회원가입 상태도 초기화하는 함수
 // 사용자가 로그아웃하거나 회원가입을 리셋할 때 호출되는 함수
  const resetAuthUser = () => {
    setUser(null);
    resetSignupUser();
  };

 // 컴포넌트가 마운트될 때 fetchUserAndData 함수 호출 (사용자 데이터를 가져옴)
  useEffect(() => {
    fetchUserAndData();
  }, [fetchUserAndData]);

  // 전역적으로 사용할 상태와 함수를 contextValue로 설정
  const contextValue = {
    user,
    userData,
    setUserData,
    fetchUserData: fetchUserAndData,
    loading,
    initializationUser,
    step,
    job_title,
    experience,
    nickname,
    blog,
    profile_image_url,
    setJob: setJobTitle,
    updateField,
    nextStep,
    prevStep,
    resetSignupUser,
    resetAuthUser,
    setNickname,
    setBlog,
    setUser: setUserFn,
    setProfileImageUrl,
  };
    // 하위 컴포넌트에게 contextValue를 전달
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// 사용자 정보를 사용하는 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser는 반드시 UserProvider 내에서 사용되어야 합니다.");
  }
  return context;
};