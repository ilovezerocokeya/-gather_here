import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useFetchUserData } from "@/hooks/useFetchUserData";
import { useUpdateUserData } from "@/hooks/useUpdateUserData";
import { UserData } from "@/types/userData";
import ProfileLoader from "@/components/Common/Skeleton/ProfileLoader";

// 사용자 데이터, 로딩 상태, 에러 메시지, 데이터를 가져오거나 업데이트하는 함수 포함
interface UserDataContextType {
  userData: UserData | null;  // 현재 유저 데이터
  loading: boolean; 
  error: string | null; 
  fetchUserData: (userId: string) => Promise<void>;  // 특정 유저 데이터를 불러오는 함수
  updateUserAnswers: (answers: Partial<UserData>) => Promise<void>;  // 유저 데이터를 업데이트하는 함수
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;  // 유저 데이터를 직접 설정하는 상태 업데이트 함수
}

// 기본값은 `undefined`로 설정하고 useUserData 훅을 통해 접근할 수 있도록 함
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// UserDataProvider: 유저 데이터를 관리하는 컨텍스트 프로바이더
export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // 유저 데이터를 가져오는 커스텀 훅
  const { userData, fetchUserData, loading, error, setUserData } = useFetchUserData();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // 유저 데이터를 업데이트하는 커스텀 훅
  const updateUserAnswers = useMemo(() => {
    return userData ? useUpdateUserData(userData, setUserData).updateUserAnswers : async () => {};
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