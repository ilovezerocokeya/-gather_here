"use client";

import { useEffect, useReducer } from "react";
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


interface HubProfileClientFormProps {
  initialIsActive: boolean;
  initialData: HubProfileState;
}

const HubProfileClientForm: React.FC<HubProfileClientFormProps> = ({ initialIsActive,  initialData }) => {
  const [state, dispatch] = useReducer(hubProfileReducer, initialData);
  const { userData } = useUserStore();
  const { likeCount, setLikeCount } = useLikeCountStore();

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
      />

      <div className="border-b-[1px] border-fillNormal my-6" />

      {/* 허브 프로필 공개/비공개 토글 영역 */}
      <HubProfileToggle
        initialIsActive={initialIsActive}
        state={state}
      />
    </>
  );
};

export default HubProfileClientForm;