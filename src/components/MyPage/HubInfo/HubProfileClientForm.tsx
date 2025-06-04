"use client";

import { useEffect, useMemo, useReducer } from "react";
import BackgroundPicture from "./components/BackgroundPicture";
import HubProfileForm from "./components/HubProfileInfo";
import SelfIntroduction from "@/components/MyPage/HubInfo/components/Introductioin";
import TeamworkQuestions from "@/components/MyPage/HubInfo/components/TeamQuestions";
import TechStack from "@/components/MyPage/HubInfo/components/TechStack";
import { HubProfileState, hubProfileReducer, } from "@/components/MyPage/HubInfo/reducer/hubProfileReducer";
import HubProfileToggle from "./HubProfileToggle";
import { useUserStore } from '@/stores/useUserStore';
import { useLikeCountStore } from "@/stores/useLikeCountStore";
import { getLikeCount } from "@/utils/like/getLikeCount";
import { useToastStore } from "@/stores/useToastStore";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";


interface HubProfileClientFormProps {
  initialIsActive: boolean;
  initialData: HubProfileState;
}

const HubProfileClientForm: React.FC<HubProfileClientFormProps> = ({ initialIsActive,  initialData }) => {
  const [state, dispatch] = useReducer(hubProfileReducer, initialData);
  const { userData, fetchUserData } = useUserStore();
  const { likeCount, setLikeCount } = useLikeCountStore();
  const { showToast } = useToastStore();
  const router = useRouter();

   // 초기값과 비교하여 변경 여부 감지
  const isChanged = useMemo(() => {
    return (
      state.description !== initialData.description ||
      state.blog !== initialData.blog ||
      state.firstLink !== initialData.firstLink ||
      state.firstLinkType !== initialData.firstLinkType ||
      state.secondLink !== initialData.secondLink ||
      state.secondLinkType !== initialData.secondLinkType ||
      state.answer1 !== initialData.answer1 ||
      state.answer2 !== initialData.answer2 ||
      state.answer3 !== initialData.answer3 ||
      state.contact !== initialData.contact ||
      JSON.stringify(state.techStacks) !== JSON.stringify(initialData.techStacks)
    );
  }, [state, initialData]);

  // 저장 처리
  const handleSave = async () => {
    if (!userData?.user_id) return;

    const { error } = await supabase
      .from("Users")
      .update({
        hubCard: initialIsActive, // 공개 여부는 그대로 유지
        description: state.description,
        blog: state.blog,
        first_link_type: state.firstLinkType,
        first_link: state.firstLink,
        second_link_type: state.secondLinkType,
        second_link: state.secondLink,
        answer1: state.answer1,
        answer2: state.answer2,
        answer3: state.answer3,
        tech_stacks: state.techStacks,
        contact: state.contact,
      })
      .eq("user_id", userData.user_id);

    if (error) {
      showToast("저장에 실패했습니다.", "error");
    } else {
      showToast("프로필이 저장되었습니다.", "success");
      void fetchUserData(userData.user_id);
      router.refresh(); // 최신 반영을 위해 강제 리렌더링
    }
  };

  // 취소 처리
  const handleCancel = () => {
    if (isChanged) {
      const confirmLeave = confirm("변경된 내용이 저장되지 않습니다. 나가시겠습니까?");
      if (!confirmLeave) return;
    }
    router.push("/");
  };

  // 프로필 좋아요 수 가져오기
  useEffect(() => {
    const fetchCount = async () => {
      if (userData?.user_id) {
        const count = await getLikeCount(userData.user_id);
        setLikeCount(count); // zustand에서 상태 저장
      }
    };
  
    void fetchCount();
  }, [userData?.user_id, setLikeCount]);

  return (
    <>
      {/* 프로필 배경 이미지와 좋아요 수 영역 */}
      <div className="flex items-center gap-4 mb-6">
        <BackgroundPicture />     
        <div className="flex flex-col">
          <h3 className="text-baseS font-semibold text-labelStrong mb-2">
            프로필 좋아요
          </h3>
          <p className="text-base text-labelNormal">
            ❤️ {likeCount}
          </p>
        </div>
      </div>

      {/* 자기소개 입력 영역 */}
      <SelfIntroduction
        description={state.description}
        setDescription={(value) => dispatch({ type: "SET_DESCRIPTION", payload: value })}
      />

      <div className="border-b-[1px] border-fillNormal my-6" />

      {/* 팀워크 관련 질문 입력 영역 */}
      <TeamworkQuestions
        answer1={state.answer1}
        setAnswer1={(value) => dispatch({ type: "SET_ANSWER1", payload: value })}
        answer2={state.answer2}
        setAnswer2={(value) => dispatch({ type: "SET_ANSWER2", payload: value })}
        answer3={state.answer3}
        setAnswer3={(value) => dispatch({ type: "SET_ANSWER3", payload: value })}
      />

      <div className="border-b-[1px] border-fillNormal my-6" />

      {/* 기술 스택 선택 영역 */}
      <TechStack
        selectedStacks={state.techStacks}
        setSelectedStacks={(value) =>
          dispatch({ type: "SET_TECH_STACKS", payload: value })
        }
      />

      <div className="border-t border-labelAssistive my-6" />

      {/* 추가 정보 입력 영역 */}
      <HubProfileForm
        blog={state.blog}
        setBlog={(value) => dispatch({ type: "SET_BLOG", payload: value })}
        firstLinkType={state.firstLinkType}
        setFirstLinkType={(value) => dispatch({ type: "SET_FIRST_LINK_TYPE", payload: value })}
        firstLink={state.firstLink}
        setFirstLink={(value) => dispatch({ type: "SET_FIRST_LINK", payload: value })}
        secondLinkType={state.secondLinkType}
        setSecondLinkType={(value) => dispatch({ type: "SET_SECOND_LINK_TYPE", payload: value })}
        secondLink={state.secondLink}
        setSecondLink={(value) => dispatch({ type: "SET_SECOND_LINK", payload: value })}
        contact={state.contact}
        setContact={(value) => dispatch({ type: "SET_CONTACT", payload: value })}
      />

      <div className="border-b-[1px] border-fillNormal my-6" />

      {/* 허브 프로필 공개/비공개 토글 영역 */}
      <HubProfileToggle
        initialIsActive={initialIsActive}
        state={state}
      />

       {/* 저장 / 취소 버튼 */}
      <div className="mt-8 flex justify-end gap-2">
        <button
          onClick={handleCancel}
          className="shared-button-gray w-[72px]"
        >
          취소
        </button>
        <button
          onClick={() => void handleSave()}
          disabled={!isChanged}
          className={`shared-button-green w-[72px] ${!isChanged ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          저장
        </button>
      </div>
    </>
  );
};

export default HubProfileClientForm;