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
import { secureImageUrl } from "@/utils/Image/imageUtils";

const CardModalClient: React.FC<CardModalProps> = ({
  user_id,
  isModalOpen,
  closeModal,
  nickname,
  job_title,
  experience,
  description,
  profile_image_url,
  background_image_url,
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

  // 모달이 닫혀 있을 경우 렌더링하지 않음
  if (!isModalOpen || !hasMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={closeModal}
      style={{ userSelect: "none" }}
    >
      <div
        className="bg-[#141415] rounded-3xl shadow-lg s:w-[380px] s:h-[580px] w-[744px] h-[800px] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-95 opacity-0"
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
          className="relative h-[300px] bg-gray-200 rounded-t-[20px] overflow-hidden cursor-pointer"
          onClick={() => window.open(blog, "_blank")}
          style={{ userSelect: "none" }}
        >
          <Image
            src={`${stripQuery(secureImageUrl(background_image_url))}?v=${imageVersion}`}
            alt="배경 이미지"
            fill
            quality={80}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* 프로필 정보 */}
        <div className="relative flex-shrink-0">
          <div className="absolute -top-20 flex flex-col items-start p-6">
            <div className="w-[120px] h-[120px] rounded-2xl bg-black border-1 border-background overflow-hidden">
              <Image
                src={`${stripQuery(secureImageUrl(profile_image_url))}?v=${imageVersion}`}
                alt={nickname}
                width={120}
                height={120}
                quality={90}
                className="object-cover w-full h-full rounded-2xl shadow-lg bg-black"
              />
            </div>
            <div className="mt-5">
              <h2 className="text-xl font-medium text-f7f7f7 font-['Pretendard'] leading-7">{nickname}</h2>
              <p className="text-primary mt-1 text-sm font-normal font-['Pretendard'] leading-[21px]">
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
              className={`p-3 rounded-xl transition flex items-center space-x-2 ${
                liked ? "bg-gray-800 text-white" : "bg-[#28282a] text-white"
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
        <div className="h-[92px] justify-start p-6 items-start gap-5 inline-flex space-x-8 md:space-x-20">
          <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">자기소개</div>
          </div>
          <div className="s:w-[240px] md:w-[524px] flex-col justify-start  items-start inline-flex">
            <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
              <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl overflow-y-auto shadow border border-[#212121] justify-between items-start inline-flex">
                <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] leading-relaxed md:leading-normal">
                  {description}
                </div>
                <div className="w-6 h-6 p-1 justify-center items-center flex">
                  <div className="h-4 p-2.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

            <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 mx-5" style={{ marginTop: "50px" }}></div>

        <div className="h-[411px] justify-start p-6 items-start gap-5 inline-flex space-x-6 md:space-x-16">
          {/* 공통질문 */}
          <div className="h-[29px] p-2 justify-start items-center gap-1 flex">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px] whitespace-nowrap">
              공통 질문
            </div>
          </div>

          <div className="s:w-[240px] md:w-[524px] flex-col justify-start items-start gap-6 inline-flex">
            {/* 질문1 */}
            <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
              <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                  1. 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.
                </div>
              </div>
              <div className="self-stretch h-[92px] py-1 flex-col justify-center  items-center flex">
                <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl overflow-y-auto  shadow border border-[#212121] justify-between items-start inline-flex">
                  <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] leading-relaxed md:leading-normal">
                    {answer1}
                  </div>
                  <div className="w-6 h-6 p-1 justify-center items-center flex">
                    <div className="h-4 p-2.5"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 질문2 */}
            <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
              <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                  2. 팀과 함께 목표를 이루기 위해 무엇이 가장 중요하다고 생각하는지 알려 주세요.
                </div>
              </div>
              <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl overflow-y-auto shadow border border-[#212121] justify-between items-start inline-flex">
                  <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] leading-relaxed md:leading-normal">
                    {answer2}
                  </div>
                  <div className="w-6 h-6 p-1 justify-center items-center flex">
                    <div className="h-4 p-2.5"></div>
                  </div>
                </div>
              </div>
            </div>  

            {/* 질문3 */}
            <div className="self-stretch h-[121px] flex-col justify-start overflow-y-auto items-start flex">
              <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                  3. 자신이 부족하다고 느낀 부분을 어떻게 보완하거나 학습해왔는지 이야기해 주세요.
                </div>
              </div>
              <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl overflow-y-auto shadow border border-[#212121] justify-between items-start inline-flex">
                  <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px]  leading-relaxed md:leading-normal">
                    {answer3}
                  </div>
                  <div className="w-6 h-6 p-1 justify-center items-center flex">
                    <div className="h-4 p-2.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

            <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 s:mt-[90px] mt-[54px] mx-5"></div>

        {/* 기술 스택 */}
        <div className="justify-start items-start p-6 gap-5 flex flex-col space-y-4">
          <div className="h-[29px] p-1 flex items-center gap-1">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">기술 스택</div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {selectedTechStacks.map((stack) => (
              <div key={stack.id} className="px-3 py-2 bg-[#28282a] rounded-full border border-[#2d2d2f] flex items-center gap-2">
                <Image src={stack.image} alt={stack.name} width={12} height={12} />
                <span className="text-white text-xs font-medium">{stack.name}</span>
              </div>
            ))}
          </div>
        </div>

            <div className="w-240px border-t border-gray-500 border-opacity-40 mx-5" style={{ marginTop: "50px" }}></div>

        {/* URL 링크 */}
        <div className="h-9 justify-start items-start gap-5 inline-flex p-6 space-x-20">
          <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
            <div className="w-[52px] text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">
              URL
            </div>
          </div>

          <div className="grow shrink basis-0 h-9 justify-start items-center gap-2 flex">
            {/* Blog 링크 */}
            <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
              <Link href={blog || "#"} target="_blank" className="flex justify-center items-center">
                <Image
                  src="/Link/link.svg"
                  alt="링크"
                  width={24}
                  height={24}
                />
              </Link>
            </div>

            {/* 첫 번째 링크 */}
            {first_link && (
              <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
                <Link href={first_link || "#"} target="_blank" className="flex justify-center items-center">
                <Image
                  src={first_link_type ? `/Link/${first_link_type}.svg` : "/Link/link.svg"}
                  alt={`${first_link_type} Link`}
                  width={24}
                  height={24}
                />
                </Link>
              </div>
            )}

            {/* 두 번째 링크 */}
            {second_link && (
              <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
                <Link href={second_link || "#"} target="_blank" className="flex justify-center items-center">
                  <Image
                    src={second_link_type ? `/Link/${second_link_type}.svg` : "/Link/link.svg"}
                    alt={`${second_link_type} Link`}
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

            <div className="w-240px border-t border-gray-500 border-opacity-10 mx-5" style={{ marginTop: "50px" }}></div>
      
      </div>
    </div>,
    document.body
  );
};

export default CardModalClient;