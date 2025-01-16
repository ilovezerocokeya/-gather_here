import React, { createContext, useState, useMemo, useCallback, ReactNode, useContext } from "react";

// 사용자 가입 상태 인터페이스
interface SignupState {
  step: number;
  job_title: string;
  experience: string;
  nickname: string;
  blog: string;
  profile_image_url: string;
}

// 초기값 상수로 분리
const initialSignupState: SignupState = {
  step: 1,
  job_title: "",
  experience: "",
  nickname: "",
  blog: "",
  profile_image_url: "",
};

// Context 인터페이스 정의
interface SignupContextType extends SignupState {
  setField: (field: keyof SignupState, value: string | number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSignupUser: () => void;
}

// Context 생성
const SignupContext = createContext<SignupContextType | undefined>(undefined);

// Provider 컴포넌트
export const UserSignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<number>(initialSignupState.step);
  const [jobTitle, setJobTitle] = useState<string>(initialSignupState.job_title);
  const [experience, setExperience] = useState<string>(initialSignupState.experience);
  const [nickname, setNickname] = useState<string>(initialSignupState.nickname);
  const [blog, setBlog] = useState<string>(initialSignupState.blog);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(initialSignupState.profile_image_url);

  // fieldSetters를 useMemo로 캐싱
  const fieldSetters: {
    [K in keyof SignupState]: (value: SignupState[K]) => void;
  } = useMemo(
    () => ({
      step: (value: number) => setStep(value),
      job_title: (value: string) => setJobTitle(value),
      experience: (value: string) => setExperience(value),
      nickname: (value: string) => setNickname(value),
      blog: (value: string) => setBlog(value),
      profile_image_url: (value: string) => setProfileImageUrl(value),
    }),
    []
  );
  
// 필드 이름(key)에 따라 해당 setter 함수를 호출하여 상태 업데이트
const setField = useCallback(
  <K extends keyof SignupState>(field: K, value: SignupState[K]) => {
    const setter = fieldSetters[field]; // 필드 이름에 해당하는 setter 함수 가져오기
    if (setter) {
      setter(value); // setter 함수 호출하여 상태 업데이트
    } else {
      console.warn(`Unknown field: ${field}`); // 필드 이름이 잘못된 경우 경고 출력
    }
  },
  [fieldSetters] // fieldSetters 객체가 변경되면 setField 함수도 업데이트
);

  // 다음 단계로 이동
  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  // 이전 단계로 이동
  const prevStep = useCallback(() => setStep((prev) => Math.max(initialSignupState.step, prev - 1)), []);

  // 가입 상태 초기화
  const resetSignupUser = useCallback(() => {
    setStep(initialSignupState.step);
    setJobTitle(initialSignupState.job_title);
    setExperience(initialSignupState.experience);
    setNickname(initialSignupState.nickname);
    setBlog(initialSignupState.blog);
    setProfileImageUrl(initialSignupState.profile_image_url);
  }, []);

  return (
    <SignupContext.Provider
      value={{
        step,
        job_title: jobTitle,
        experience,
        nickname,
        blog,
        profile_image_url: profileImageUrl,
        setField,
        nextStep,
        prevStep,
        resetSignupUser,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

// Hook을 통한 Context 사용
export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup은 UserSignupProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};