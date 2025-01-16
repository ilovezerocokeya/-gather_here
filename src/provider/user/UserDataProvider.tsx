"use client";

import React, { createContext, useState, useCallback, ReactNode, useContext } from "react";
import { createClient } from "@/utils/supabase/client";

// 사용자 데이터를 나타내는 인터페이스
interface UserData {
  user_id: string;
  nickname: string;
  job_title: string;
  experience: string;
  description: string;
  profile_image_url: string;
  blog: string;
  hubCard?: boolean;
  background_image_url?: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  first_link_type?: string;
  first_link?: string;
  second_link_type?: string;
  second_link?: string;
  tech_stacks?: string[];
}

// Context에서 제공할 데이터 및 함수 정의
interface UserDataContextType {
  userData: UserData | null; // 사용자 데이터
  loading: boolean; // 로딩 상태
  error: string | null; // 에러 상태
  fetchUserData: (userId: string) => Promise<void>; // 사용자 데이터를 가져오는 함수
  setUserData: (data: UserData | null) => void; // 사용자 데이터를 설정하는 함수
  updateUserAnswers: (answers: Partial<UserData>) => Promise<void>; // 사용자 답변 업데이트 함수
}

// Context 생성
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClient();
  const [userData, setUserDataState] = useState<UserData | null>(null); // 사용자 데이터 상태
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 사용자 데이터를 가져오는 함수
  const fetchUserData = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("Users")
        .select(
          "user_id, nickname, job_title, experience, description, profile_image_url, blog, hubCard, background_image_url, answer1, answer2, answer3, first_link_type, first_link, second_link_type, second_link, tech_stacks"
        )
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        throw new Error(error?.message || "사용자 데이터를 가져오는 데 실패했습니다.");
      }

      if (isUserData(data)) {
        setUserDataState(data);
      } else {
        throw new Error("반환된 데이터가 예상과 일치하지 않습니다.");
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      setUserDataState(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // 사용자 답변을 업데이트하는 함수
  const updateUserAnswers = useCallback(
    async (answers: Partial<UserData>) => {
      if (!userData || !userData.user_id) return;

      setError(null);
      try {
        const { error } = await supabase
          .from("Users")
          .update(answers)
          .eq("user_id", userData.user_id);

        if (error) {
          throw new Error(error.message);
        }

        setUserDataState((prev) => (prev ? { ...prev, ...answers } : null));
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
        setError(errorMessage);
      }
    },
    [supabase, userData]
  );

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        error,
        fetchUserData,
        setUserData: setUserDataState,
        updateUserAnswers,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// Context 데이터를 사용하는 커스텀 훅
export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData는 UserDataProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

// 사용자 데이터 타입 검증 함수
export const isUserData = (data: any): data is UserData => {
  return (
    typeof data.user_id === "string" &&
    typeof data.nickname === "string" &&
    typeof data.job_title === "string" &&
    typeof data.experience === "string" &&
    typeof data.description === "string" &&
    typeof data.profile_image_url === "string" &&
    typeof data.blog === "string" &&
    (data.hubCard === undefined || typeof data.hubCard === "boolean") &&
    (data.background_image_url === undefined || typeof data.background_image_url === "string") &&
    (data.answer1 === undefined || typeof data.answer1 === "string") &&
    (data.answer2 === undefined || typeof data.answer2 === "string") &&
    (data.answer3 === undefined || typeof data.answer3 === "string") &&
    (data.first_link_type === undefined || typeof data.first_link_type === "string") &&
    (data.first_link === undefined || typeof data.first_link === "string") &&
    (data.second_link_type === undefined || typeof data.second_link_type === "string") &&
    (data.second_link === undefined || typeof data.second_link === "string")
  );
};
