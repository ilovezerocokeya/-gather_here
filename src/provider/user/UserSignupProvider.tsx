"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SignupState {
  step: number;
  job_title: string;
  experience: string;
  nickname: string;
  blog: string;
  profile_image_url: string;
  setField: (field: keyof SignupState, value: string | number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSignupUser: () => void;
  setJob: (job_title: string) => void;
  setProfileImageUrl: (url: string) => void;
  setBlog: (blog: string) => void;
  setNickname: (nickname: string) => void;
}

const defaultSignupState: SignupState = {
  step: 1,
  job_title: "",
  experience: "",
  nickname: "",
  blog: "",
  profile_image_url: "",
  setField: () => {},
  nextStep: () => {},
  prevStep: () => {},
  resetSignupUser: () => {},
  setJob: () => {},
  setProfileImageUrl: () => {},
  setBlog: () => {},
  setNickname: () => {},
};

const SignupContext = createContext<SignupState>(defaultSignupState);

export const UserSignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<number>(1);
  const [job_title, setJobTitle] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [blog, setBlog] = useState<string>("");
  const [profile_image_url, setProfileImageUrl] = useState<string>("");

  const setField = useCallback((field: keyof SignupState, value: string | number) => {
    const fieldSetters: Record<keyof SignupState, (value: any) => void> = {
      step: (v) => setStep(v as number),
      job_title: (v) => setJobTitle(v as string),
      experience: (v) => setExperience(v as string),
      nickname: (v) => setNickname(v as string),
      blog: (v) => setBlog(v as string),
      profile_image_url: (v) => setProfileImageUrl(v as string),
      setField: () => {},
      nextStep: () => {},
      prevStep: () => {},
      resetSignupUser: () => {},
      setJob: () => {},
      setProfileImageUrl: () => {},
      setBlog: () => {},
      setNickname: () => {},
    };

    if (fieldSetters[field]) {
      fieldSetters[field](value);
    } else {
      console.warn(`Unknown field: ${field}`);
    }
  }, []);

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => Math.max(1, prev - 1)), []);
  const setJob = useCallback((job_title: string) => setJobTitle(job_title), []);
  const resetSignupUser = useCallback(() => {
    setStep(1);
    setJobTitle("");
    setExperience("");
    setNickname("");
    setBlog("");
    setProfileImageUrl("");
  }, []);

  const contextValue: SignupState = {
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
  };

  return <SignupContext.Provider value={contextValue}>{children}</SignupContext.Provider>;
};

export const useSignup = (): SignupState => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup는 UserSignupProvider 내부에서 호출되어야 합니다.");
  }
  return context;
};