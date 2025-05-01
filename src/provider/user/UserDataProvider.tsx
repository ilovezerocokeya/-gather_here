import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useFetchUserData } from "@/hooks/useFetchUserData";
import { useUpdateUserData } from "@/hooks/useUpdateUserData";
import { UserData } from "@/types/userData";
import { supabase } from "@/utils/supabase/client";
import ProfileLoader from "@/components/Common/Skeleton/ProfileLoader";

// 사용자 데이터, 로딩 상태, 에러 메시지, 데이터를 가져오거나 업데이트하는 함수 포함
interface UserDataContextType {
  userData: UserData | null;  // 현재 유저 데이터
  loading: boolean; 
  error: string | null; 
  fetchUserData: (userId: string) => Promise<void>;  // 특정 유저 데이터를 불러오는 함수
  updateUserAnswers: ((answers: Partial<UserData>) => Promise<void>) | undefined;  // 유저 데이터를 업데이트하는 함수
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;  // 유저 데이터를 직접 설정하는 상태 업데이트 함수
}

// 기본값은 `undefined`로 설정하고 useUserData 훅을 통해 접근할 수 있도록 함
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// UserDataProvider: 유저 데이터를 관리하는 컨텍스트 프로바이더
export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userData: rawUserData, fetchUserData, loading, error, setUserData } = useFetchUserData(); // 유저 데이터를 가져오는 커스텀 훅
  const [hydrated, setHydrated] = useState(false);
  const userData = useMemo(() => {
    if (!rawUserData) return null;
    return {
      ...rawUserData,
      imageVersion: rawUserData.imageVersion ?? 0, // 초기값 보장
    };
  }, [rawUserData]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id;
  
      if (userId) {
        await fetchUserData(userId); // 자동 호출
      } else {
        setUserData(null); // 로그아웃 상태로 명시
      }
  
      setHydrated(true); // hydration 완료
    };
  
    void init();
  }, [fetchUserData, setUserData]);

  // 유저 데이터를 업데이트하는 커스텀 훅
  const updateUserAnswers = useMemo(() => {
    if (userData) {
      return useUpdateUserData(userData, setUserData).updateUserAnswers;
    }
    return undefined;  // userData가 없으면 undefined 반환
  }, [userData, setUserData]);

  if (!hydrated || (loading && !userData)) {
    return <ProfileLoader />; 
  }

  return (
    <UserDataContext.Provider
      value={{
        userData,  // 현재 유저 데이터
        loading,
        error,  
        fetchUserData,  // 유저 데이터를 불러오는 함수
        updateUserAnswers,  // 유저 데이터를 업데이트하는 함수
        setUserData,  // 유저 데이터를 직접 설정하는 함수
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// useUserData: UserDataContext를 사용하는 커스텀 훅
export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData는 UserDataProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};