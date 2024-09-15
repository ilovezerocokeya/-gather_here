import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  resetAuthUser: () => void;
}

interface UserData {
  nickname: string;
  job_title: string;
  experience: string;
  profile_image_url: string;
  blog: string;
}

interface SignupState {
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

interface StoreState extends AuthState, SignupState {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void; // userData를 null로 설정할 수 있게 변경
  fetchUserData: () => Promise<void>;
  initializationUser: () => void;
  loading: boolean; // 로딩 상태 추가
}

const UserContext = createContext<StoreState | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClient(); // Supabase 클라이언트 생성

  // 사용자 상태
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null); // null 초기값
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가

  // 회원가입 상태
  const [step, setStep] = useState<number>(1);
  const [job_title, setJobTitle] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [blog, setBlog] = useState<string>("");
  const [profile_image_url, setProfileImageUrl] = useState<string>("");

  // 세션 확인 함수
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true); // 세션 확인 중 로딩 상태 true
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
          return;
        }

        if (session?.user) {
          setAuthUser(session.user);
        }
      } catch (error) {
        console.error("Error during session check:", error);
      } finally {
        setLoading(false); // 세션 확인 후 로딩 상태 false
      }
    };

    if (!user) {
      checkSession();
    }
  }, [user, supabase]);

  // 사용자 데이터 호출
  const fetchUserData = useCallback(async () => {
    if (!user || !user.id || userData) return;

    setLoading(true); // 사용자 데이터를 불러오는 동안 로딩 상태 true
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('nickname, job_title, experience, profile_image_url, blog')
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
        return;
      }

      if (data) {
        setUserData(data as UserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // 데이터 호출 완료 후 로딩 상태 false
    }
  }, [user, userData, supabase]);

  // 사용자 설정 함수
  const setAuthUser = useCallback(async (user: User | null) => {
    setUser(user);
    setIsAuthenticated(!!user);

    if (user && !userData) {
      await fetchUserData();
    }
  }, [fetchUserData, userData]);

  // 사용자 초기화 함수
  const resetAuthUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setUserData(null); // 유저 데이터도 null로 초기화
  }, []);

  // 회원가입 상태 필드 설정
  const setField = useCallback((field: keyof SignupState, value: string) => {
    switch (field) {
      case "job_title":
        setJobTitle(value);
        break;
      case "experience":
        setExperience(value);
        break;
      case "nickname":
        setNickname(value);
        break;
      case "blog":
        setBlog(value);
        break;
      case "profile_image_url":
        setProfileImageUrl(value);
        break;
      default:
        break;
    }
  }, []);

  const setJob = (job_title: string) => setJobTitle(job_title);
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // 회원가입 상태 초기화
  const resetSignupUser = () => {
    setStep(1);
    setJobTitle("");
    setExperience("");
    setNickname("");
    setBlog("");
    setProfileImageUrl("");
  };

  // 사용자 상태 초기화
  const initializationUser = () => {
    resetAuthUser();
    resetSignupUser();
  };

  const contextValue: StoreState = {
    user,
    isAuthenticated,
    setUser: setAuthUser,
    resetAuthUser,
    userData,
    setUserData,
    fetchUserData,
    initializationUser,
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
    setJob,
    setProfileImageUrl,
    setBlog,
    setNickname,
    loading, // 추가된 로딩 상태
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Hook을 통한 Context 사용
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser는 UserProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
