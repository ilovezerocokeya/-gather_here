"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { CardModalProps } from "@/lib/gatherHub";
import { stripQuery } from "@/utils/Image/imageUtils";
import { supabase } from "@/utils/supabase/client";
import { techStacks } from "@/lib/generalOptionStacks";
import { useToastStore } from "@/stores/useToastStore";
import { useLikeStore } from "@/stores/useLikeStore";
import { FALLBACK_PROFILE_IMAGE } from "@/utils/Image/imageUtils";
import { secureImageUrl } from "@/utils/Image/imageUtils";
import { useUserStore } from "@/stores/useUserStore";

const CardModalClient: React.FC<CardModalProps> = ({
  user_id,
  isModalOpen,
  closeModal,
  nickname,
  job_title,
  experience,
  description,
  background_image_url,
  profile_image_url,
  blog,
  answer1,
  answer2,
  answer3,
  first_link_type,
  first_link,
  second_link_type,
  second_link,
  imageVersion,
  tech_stacks,
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { toggleLike, likedMembers } = useLikeStore();
  const liked = likedMembers[user_id] ?? false;
  const { showToast } = useToastStore();
  const { userData } = useUserStore();
  const currentUserId = userData?.user_id;
  const isMyCard = currentUserId === user_id;
  const [isImageBroken, setIsImageBroken] = useState(false);

  const selectedTechStacks = useMemo(() => {
    if (!tech_stacks || !Array.isArray(tech_stacks)) return [];
    return techStacks.filter((stack) => tech_stacks.includes(stack.id));
  }, [tech_stacks]);

  // hydration mismatch 방지를 위한 마운트 체크
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    const preventKeys = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal?.();
    };

    if (isModalOpen) {
      // 데스크탑 스크롤 방지
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = "100%";

      // 모바일 스크롤 방지
      document.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("keydown", preventKeys);
    }

    return () => {
      // 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);

      // 모바일 스크롤 복원
      document.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, [isModalOpen, closeModal]);

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = useCallback(async () => {
    const { data: { session }
    } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }

    try {
      await toggleLike(user_id, currentUserId);
    } catch (error) {
      console.error("좋아요 실패:", error);
      showToast("좋아요 처리 중 오류가 발생했어요", "error");
    }
  }, [toggleLike, user_id, showToast]);

  // 프로필 이미지 URL 생성
  const versionedProfileImage = `${stripQuery(secureImageUrl(profile_image_url))}${
    isMyCard ? `?v=${imageVersion ?? 0}` : ''
  }`;

  // 배경 이미지 URL 생성
  const versionedBackgroundImage = `${stripQuery(secureImageUrl(background_image_url))}${
    isMyCard ? `?v=${imageVersion ?? 0}` : ''
  }`;

  // imageUrl이 바뀌면 깨짐 상태 초기화
  useEffect(() => {
    setIsImageBroken(false);
  }, [versionedProfileImage]);

  // 모달이 닫혀 있을 경우 렌더링하지 않음
  if (!isModalOpen || !hasMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={closeModal}
      style={{ userSelect: "none" }}
    >
      <div
        className="bg-[#141415] rounded-3xl shadow-lg s:w-[390px] s:h-[600px] w-[744px] h-[700px] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-95 opacity-0"
        style={{
          opacity: isModalOpen ? 1 : 0,
          transform: isModalOpen ? "scale(1)" : "scale(0.95)",
          userSelect: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 bg-primary text-black text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-xl md:hover:bg-white md:hover:scale-110 transition-transform duration-200 ease-in-out z-50"
          onClick={closeModal}
          style={{ userSelect: "none" }}
        >
          &times;
        </button>

        {/* 대표 포트폴리오 이미지 */}
        <div
          className="relative h-[200px] md:h-[300px] bg-gray-200 rounded-t-[20px] overflow-hidden cursor-pointer"
          onClick={() => window.open(blog, "_blank")}
          style={{ userSelect: "none" }}
        >
          <Image
            src={versionedBackgroundImage}
            alt={`${nickname}님의 대표 포트폴리오 이미지`}
            fill
            sizes="(max-width: 768px) 90vw, 300px"
            quality={85}
            priority
            loading="eager"
            fetchPriority="high"
            style={{ objectFit: "cover", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          />
        </div>

        {/* 프로필 정보 */}
        <div className="relative flex-shrink-0">
          <div className="absolute -top-20 flex flex-col items-start p-6">
            <div className="w-[120px] h-[120px] rounded-2xl bg-black border-1 border-background overflow-hidden">
              <Image
                src={isImageBroken ? FALLBACK_PROFILE_IMAGE : versionedProfileImage}
                alt={`${nickname}님의 프로필 사진`}
                onError={() => setIsImageBroken(true)}
                width={60}
                height={60}
                className="object-cover w-full h-full rounded-2xl shadow-lg bg-black"
              />
            </div>
            <div className="mt-5 ml-2">
              <h2 className="text-xl font-medium text-f7f7f7 font-['Pretendard'] leading-7">{nickname}</h2>
              <p className="text-primary mt-1 ml-4 text-ml font-normal font-['Pretendard'] leading-[21px]">
                {job_title}
                <span className="text-[#5e5e5e] text-sm font-normal font-['Pretendard'] leading-[21px]">
                  &nbsp; |&nbsp; {experience}
                </span>
              </p>
            </div>
          </div>


          {/* 버튼 영역 */}
          <div className="absolute top-[-25px] right-[20px] flex items-center space-x-4 p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                void handleLikeClick();
              }}
              className={`p-3 rounded-xl transition flex items-center space-x-2 ${liked ? "bg-gray-800 text-white" : "bg-[#28282a] text-white"
                } md:hover:bg-gray-900 md:hover:-rotate-3 md:hover:scale-102.5`}
            >
              <Image
                src={liked ? "/assets/bookmark2.svg" : "/assets/bookmark1.svg"}
                alt="북마크"
                width={16}
                height={16}
              />
              <span className="hidden md:block">북마크 저장하기</span>
            </button>

            <div className="relative group">
              <button
                className="bg-[#28282a] text-white px-4 py-3 rounded-xl md:hover:bg-gray-900 transition flex items-center space-x-2"
                style={{ userSelect: "none", cursor: "not-allowed" }}
                disabled
              >
                <Image
                  src="/assets/chat.svg"
                  alt="메시지 아이콘"
                  width={20}
                  height={20}
                />
                <span className="hidden md:block" suppressHydrationWarning>
                  대화 신청하기
                </span>

                {/* 말풍선 */}
                <div className="absolute s:top-[50px] top-[100%] s:left-[-5px] left-[65%] transform -translate-x-1/2 min-w-[120px] px-3 py-2 bg-[orange] text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                  현재 개발 중인 <br /> 기능 입니다.
                  <div className="absolute top-[-6px] s:left-[70%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[orange] rotate-45"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 mt-40 mx-5"></div>

        {/* 자기소개 섹션 */}
        <div className="flex flex-col md:flex-row justify-start md:justify-start items-center md:items-start gap-4 md:gap-2 p-6 md:ml-8 md:h-[92px] md:space-x-8 md:space-x-19">
          <div className="h-[29px] p-2 flex justify-center md:justify-start items-center text-center">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px] whitespace-nowrap">
              자기소개
            </div>
          </div>

          <div className="w-full s:w-[320px] md:w-[480px] flex flex-col items-center md:items-start">
            <div className="w-full py-1 flex flex-col items-center md:items-start">
              <div className="w-full max-h-[120px] p-3 bg-[#19191a] rounded-xl overflow-y-auto shadow border border-[#212121]">
                <p className="text-[13px] text-gray-200 leading-relaxed font-sans font-light text-center md:text-left whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 s:mt-[20px] mt-[54px] mx-5" />

        {/* 공통질문 섹션 */}
        <div className="flex flex-col md:flex-row justify-start items-center md:items-start gap-4 md:gap-2 p-6 md:ml-8 md:space-x-8">
          {/* 왼쪽 타이틀 */}
          <div className="h-[29px] p-2 flex justify-center md:justify-start items-center text-center">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px] whitespace-nowrap">
              공통 질문
            </div>
          </div>

          {/* 질문 목록 */}
          <div className="w-full s:w-[320px] md:w-[480px] flex flex-col items-center md:items-start gap-12">
            {[
              {
                id: 1,
                question: "1. 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.",
                answer: answer1,
              },
              {
                id: 2,
                question: "2. 팀과 함께 목표를 이루기 위해 무엇이 가장 중요하다고 생각하는지 알려 주세요.",
                answer: answer2,
              },
              {
                id: 3,
                question: "3. 자신이 부족하다고 느낀 부분을 어떻게 보완하거나 학습해왔는지 이야기해 주세요.",
                answer: answer3,
              },
            ].map(({ id, question, answer }) => (
              <div key={id} className="w-full flex flex-col">
                <p className="text-neutral-300 text-sm s:text-xs font-normal font-sans leading-snug text-center md:text-left">
                  {question}
                </p>
            
                <div className="w-full h-auto py-1">
                  <div className="w-full max-h-[120px] p-3 bg-[#19191a] rounded-xl mt-2 overflow-y-auto shadow border border-[#212121]">
                    <p className="text-[13px] text-gray-200 leading-relaxed font-sans font-light text-center md:text-left whitespace-pre-wrap">
                      {answer && answer.trim() !== ""
                        ? answer
                        : "😅 아직 답변이 준비되지 않았어요."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 s:mt-[20px] mt-[54px] mx-5"></div>

        {/* 기술 스택 섹션 */}
        <div className="flex flex-col md:flex-row justify-start items-center md:items-start gap-4 md:gap-2 p-6 md:ml-8 md:space-x-8">
          {/* 타이틀 */}
          <div className="h-[29px] p-2 flex justify-center md:justify-start items-center text-center">
            <div className="text-neutral-300 text-sm font-medium font-['Pretendard'] leading-[21px] whitespace-nowrap">
              기술 스택
            </div>
          </div>

          {/* 스택 목록 */}
          <div className="w-full s:w-[320px] md:w-[480px] flex flex-col items-center md:items-start">
            <div className="grid grid-cols-3 gap-3 w-full">
              {selectedTechStacks.map((stack) => (
                <div
                  key={stack.id}
                  className="px-3 py-2 bg-[#28282a] rounded-full border border-[#2d2d2f] flex items-center gap-2"
                >
                  <Image src={stack.image} alt={stack.name} width={12} height={12} />
                  <span className="text-neutral-200 text-xs font-normal font-sans">{stack.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-240px border-t border-gray-500 border-opacity-40 mx-5" style={{ marginTop: "20px" }}></div>

        {/* URL 링크 섹션 */}
        <div className="flex flex-col md:flex-row justify-start items-center md:items-start gap-4 md:gap-2 p-6 md:ml-8 md:space-x-8">
          {/* 타이틀 */}
          <div className="h-[29px] p-2 flex justify-center md:justify-start items-center text-center">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px] whitespace-nowrap">
              URL
            </div>
          </div>

          {/* 링크 아이콘들 */}
          <div className="flex justify-center md:justify-start items-center gap-2 w-full s:w-[320px] md:w-[480px]">
            {/* 블로그 링크 */}
            <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] flex justify-center items-center">
              <Link href={blog || "#"} target="_blank" className="flex justify-center items-center">
                <Image src="/Link/link.svg" alt="블로그 링크" width={24} height={24} />
              </Link>
            </div>

            {/* 첫 번째 링크 */}
            {first_link && (
              <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] flex justify-center items-center">
                <Link href={first_link || "#"} target="_blank" className="flex justify-center items-center">
                  <Image
                    src={first_link_type ? `/Link/${first_link_type}.svg` : "/Link/link.svg"}
                    alt={`${first_link_type} 링크`}
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            )}

            {/* 두 번째 링크 */}
            {second_link && (
              <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] flex justify-center items-center">
                <Link href={second_link || "#"} target="_blank" className="flex justify-center items-center">
                  <Image
                    src={second_link_type ? `/Link/${second_link_type}.svg` : "/Link/link.svg"}
                    alt={`${second_link_type} 링크`}
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 s:mt-[20px] mt-[54px] mx-5" />

      </div>
    </div>,
    document.body
  );
};

export default CardModalClient;