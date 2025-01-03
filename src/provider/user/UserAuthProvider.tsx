import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

// 사용자 인증 상태 인터페이스
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  resetAuthUser: () => void;
}

// Context 생성
const AuthContext = createContext<AuthState | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClient();

  // 사용자 인증 상태
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 사용자 인증 정보를 설정하는 함수
  const setAuthUser = useCallback(
    async (user: User | null) => {
      setUserState(user);
      setIsAuthenticated(!!user); // 사용자가 있으면 true, 없으면 false로 설정
    },
    []
  );

  // 사용자 인증 상태를 초기화하는 함수 (로그아웃 시 호출)
  const resetAuthUser = useCallback(() => {
    setUserState(null);
    setIsAuthenticated(false);
    document.cookie = "supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    console.log("사용자 인증 상태 초기화 및 쿠키 삭제");
  }, []);

  // 앱 로드 시 세션 확인
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("세션 가져오는 중 오류:", error.message);
          return;
        }

        if (data?.user) {
          setAuthUser(data.user);
        } else {
          console.log("로그인된 사용자가 없습니다.");
        }
      } catch (error) {
        console.error("세션 확인 중 오류:", error);
      }
    };

    if (!user) {
      checkSession(); // 로그인된 사용자가 없을 경우 세션을 확인
    }
  }, [user, supabase, setAuthUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser: setAuthUser, resetAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook을 통한 Context 사용
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 UserAuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};