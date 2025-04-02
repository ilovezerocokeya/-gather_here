import React, { createContext, useState, useCallback, ReactNode, useContext, useEffect } from "react";

// 회원가입 상태 인터페이스 (step만 유지)
interface SignupState {
  step: number;
}

// 초기값 상수로 분리
const initialSignupState: SignupState = {
  step: 1,
};

// Context 인터페이스 정의
interface SignupContextType extends SignupState {
  nextStep: () => void;
  prevStep: () => void;
  resetSignupUser: () => void;
}

// Context 생성
const SignupContext = createContext<SignupContextType | undefined>(undefined);

// Provider 컴포넌트
export const UserSignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<number | undefined>(undefined);

  useEffect(() => {
    setStep(initialSignupState.step);
  }, []);

  // 다음 단계로 이동
  const nextStep = useCallback(() => setStep((prev) => (prev ?? 1) + 1), []);

  // 이전 단계로 이동
  const prevStep = useCallback(() => setStep((prev) => Math.max(initialSignupState.step, (prev ?? 1) - 1)), []);
  // 가입 상태 초기화
  const resetSignupUser = useCallback(() => {
    setStep(initialSignupState.step);
  }, []);

  if (step === undefined) {
    return null;
  }

  return (
    <SignupContext.Provider
      value={{
        step,
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