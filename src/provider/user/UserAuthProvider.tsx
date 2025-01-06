import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

// 사용자 인증 상태 인터페이스
interface AuthState {
  user: User | null; // 현재 인증된 사용자 정보
  isAuthenticated: boolean; // 사용자가 인증되었는지 여부
  setUser: (user: User | null) => Promise<void>; // 사용자 정보를 설정하는 함수
  resetAuthUser: () => Promise<void>; // 사용자 인증 상태를 초기화하는 함수 (로그아웃)
  authError: string | null; // 인증 관련 에러 메시지
}

// Context 생성
const AuthContext = createContext<AuthState | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClient();

  // 사용자 인증 상태
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 사용자 인증 정보를 설정하는 함수
  const setAuthUser = useCallback(async (user: User | null) => {
    try {
      setUserState(user);
      setIsAuthenticated(!!user);
    } catch (error) {
      const errorMessage = "사용자 설정 중 오류가 발생했습니다.";
      console.error(errorMessage, error);
      setAuthError(errorMessage);
    }
  }, []);

  // 사용자 인증 상태를 초기화하는 함수 (로그아웃 시 호출)
  const resetAuthUser = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUserState(null);
      setIsAuthenticated(false);
      setAuthError(null); // 에러 상태 초기화
    } catch (error) {
      const errorMessage = "로그아웃 중 오류가 발생했습니다.";
      console.error(errorMessage, error);
      setAuthError(errorMessage);
    }
  }, [supabase]);

  // 앱 로드 시 세션 확인
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          const errorMessage = "세션 가져오는 중 오류가 발생했습니다.";
          console.error(errorMessage, error.message);
          setAuthError(errorMessage);
          return;
        }

        if (data?.user) {
          await setAuthUser(data.user);
        } else {
          console.log("로그인된 사용자가 없습니다.");
        }
      } catch (error) {
        const errorMessage = "세션 확인 중 오류가 발생했습니다.";
        console.error(errorMessage, error);
        setAuthError(errorMessage);
      }
    };

    checkSession();
  }, [setAuthUser, supabase]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser: setAuthUser, resetAuthUser, authError }}>
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