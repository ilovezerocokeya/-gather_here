import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from "react";
import { supabase } from "@/utils/supabase/client"; 
import { User } from "@supabase/supabase-js";

// 사용자 인증 상태 인터페이스
interface AuthState {
  user: User | null; // 현재 인증된 사용자 정보
  isAuthenticated: boolean; // 사용자가 인증되었는지 여부
  setUser: (user: User | null) => void;// 사용자 정보를 설정하는 함수
  resetAuthUser: () => Promise<void>; // 사용자 인증 상태를 초기화하는 함수 (로그아웃)
  authError: string | null; // 인증 관련 에러 메시지
  isLoading: boolean;
}

// Context 생성
const AuthContext = createContext<AuthState | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // 사용자 인증 상태
  const [user, setUserState] = useState<User | null>(null); // 현재 로그인된 사용자 정보
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // 인증 여부
  const [authError, setAuthError] = useState<string | null>(null); // 인증 에러 메시지
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 사용자 인증 정보를 설정하는 함수
  const setAuthUser = useCallback((user: User | null) => {
    setUserState(user); // 사용자 정보 설정
    setIsAuthenticated(!!user); // 사용자 인증 여부 설정
  }, []);

  // 사용자 인증 상태를 초기화하는 함수 (로그아웃 시 호출)
  const resetAuthUser = useCallback(async () => {
    try {
      await supabase.auth.signOut(); // Supabase 로그아웃 호출
      setUserState(null); // 사용자 정보 초기화
      setIsAuthenticated(false); // 인증 여부 초기화
      setAuthError(null); // 에러 초기화
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      setAuthError("로그아웃 중 오류가 발생했습니다.");
    }
  }, []);

  // 앱 로드 시 세션 확인
  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("세션 가져오는 중 오류 발생:", error.message);
        setAuthError("세션 가져오는 중 오류가 발생했습니다.");
      } else if (data?.session?.user) {
        setAuthUser(data.session.user);
      } else {
        console.log("로그인된 사용자가 없습니다.");
      }
    } catch (error) {
      console.error("세션 확인 중 오류 발생:", error);
      setAuthError("세션 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [setAuthUser]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setUser: setAuthUser,
        resetAuthUser,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook을 통한 Context 사용
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 UserAuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
