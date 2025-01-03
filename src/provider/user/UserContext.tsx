/**
 * - 사용자 관련 전역 상태를 관리하기 위한 Context 인터페이스 정의 컴포넌트
 * - 사용자 인증 상태, 프로필 데이터, 회원가입 상태 등을 통합적으로 관리
 * - 이 컴포넌트를 통해 다른 컴포넌트에서 전역적으로 필요한 사용자 관련 데이터를 공유 가능
 */

import { createContext } from "react";
import { User } from "@supabase/supabase-js";

// 사용자 인증 상태 인터페이스
export interface AuthState {
  user: User | null; // 현재 로그인한 사용자
  isAuthenticated: boolean; // 사용자의 인증 여부
  setUser: (user: User | null) => void; // 사용자를 설정하는 함수
  resetAuthUser: () => void; // 사용자 인증 정보를 초기화하는 함수
}

// 사용자의 프로필과 관련된 데이터를 관리하는 인터페이스
export interface UserData {
  id: string;
  nickname: string;
  job_title: string;
  experience: string;
  description: string; // 자기소개
  profile_image_url: string;
  blog: string; // 대표 포트폴리오
  hubCard?: boolean;
  background_image_url?: string; // 포트폴리오 이미지
  answer1?: string;
  answer2?: string;
  answer3?: string;
  first_link_type?: string;
  first_link?: string;
  second_link_type?: string;
  second_link?: string;
  tech_stacks?: string[];
}

// 회원가입 상태를 관리하는 인터페이스
export interface SignupState {
  step: number;
  job_title: string;
  experience: string;
  nickname: string;
  blog: string;
  profile_image_url: string;
  setField: (field: keyof SignupState, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSignupUser: () => void;
  setJob: (job_title: string) => void;
  setProfileImageUrl: (url: string) => void;
  setBlog: (blog: string) => void;
  setNickname: (nickname: string) => void;
}

// 전체 상태를 관리하는 인터페이스
export interface StoreState extends AuthState, SignupState {
  userData: UserData | null; // 사용자 관련 데이터
  setUserData: (data: UserData | null) => void; // 사용자 데이터를 설정하는 함수
  fetchUserData: () => Promise<void>; // 사용자 데이터를 가져오는 함수
  initializationUser: () => void; // 모든 사용자 관련 상태를 초기화하는 함수
  loading: boolean; // 로딩 상태 (비동기 작업 동안 true)
  description?: string; // description 추가
  background_image_url?: string; // background_image_url 추가
  hubCard?: boolean; // hubCard 추가
  likedMembers: { [key: string]: boolean }; // 특정 유저에 대한 좋아요 상태를 저장하는 객체
  toggleLike: (nickname: string) => void; // 좋아요 상태를 변경하는 함수, nickname을 인자로 받아 상태를 변경함
  updateUserAnswers: (answers: { answer1?: string; answer2?: string; answer3?: string }) => Promise<void>; // 사용자 답변을 업데이트하는 비동기 함수
  tech_stacks?: string[];
}

// Context 생성
export const UserContext = createContext<StoreState | undefined>(undefined);
