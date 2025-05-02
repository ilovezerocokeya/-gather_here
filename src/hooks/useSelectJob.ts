import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/provider/ContextProvider';
import { useSignup } from '@/provider/user/UserSignupProvider';
import { useUserStore } from "@/stores/useUserStore";
import { defaultUserData } from "@/types/userData";

const useSelectJob = () => {
  const { nextStep } = useSignup(); 
  const { userData, setUserData } = useUserStore(); 
  const [selectedJob, setSelectedJob] = useState<string>('');
  const router = useRouter();
  const { closeModal } = useModal();

  // 직업 선택 핸들러
  const handleJobSelection = (job_title: string) => {
    setSelectedJob(job_title);
    setUserData({
      ...(userData ?? defaultUserData),
      job_title,
    });
    nextStep();
  };

  // 스킵 버튼 클릭 핸들러
  const handleSkip = () => {
    const confirmSkip = window.confirm("기본정보는 마이페이지에서 수정할 수 있습니다. 계속하시겠습니까?");
    if (confirmSkip) {
      closeModal();
      router.push('/');
    }
  };

  return {
    selectedJob,
    handleJobSelection,
    handleSkip,
  };
};

export default useSelectJob;