"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { stripQuery } from "@/utils/Image/imageUtils";
import { CardUIProps } from "@/lib/gatherHub";

const CardUI: React.FC<CardUIProps> = ({
  nickname,
  job_title,
  experience,
  description,
  background_image_url,
  profile_image_url,
  blog,
  first_link_type,
  first_link,
  second_link_type,
  second_link,
  onOpenModal,
  onOpenProfile,
  liked,
  handleToggleLike,
  secureImageUrl,
  imageVersion
}) => {
  
  // 이미지 캐시를 무효화하기 위해 기존 URL에서 쿼리스트링 제거 후 버전 쿼리 추가
  const versionedProfileImage = `${stripQuery(secureImageUrl(profile_image_url))}?v=${imageVersion ?? 0}`;
  const versionedBackgroundImage = `${stripQuery(secureImageUrl(background_image_url))}?v=${imageVersion ?? 0}`;

  useEffect(() => {
    console.log("[CardUI] profile_image_url (원본):", profile_image_url);
    console.log("[CardUI] 최종 렌더링될 profile 이미지 URL:", versionedProfileImage);
  }, [profile_image_url, versionedProfileImage]);

  return (
    <div
      className="member-card bg-fillStrong rounded-[20px] shadow-lg relative w-[290px] h-96 flex-col user-select-none justify-start items-center gap-[78px] inline-flex"
      style={{ userSelect: "none" }}
    >
      {/* 좋아요 버튼 */}
      <div className="absolute top-3 right-3 z-10 justify-center items-center gap-2.5 flex">
        <button
            onClick={handleToggleLike}
            className="p-1 rounded-[9px] bg-[#141415] border border-[#2d2d2f] shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-110"
            style={{ userSelect: "none" }}
          >
            <Image
              src={liked ? "/assets/bookmark2.svg" : "/assets/bookmark1.svg"}
              alt="좋아요"
              width={16}
              height={16}
              loading= "lazy"
            /> 
        </button>
      </div>

      {/* 메시지 보내기 버튼 */}
      <div className="absolute bottom-[200px] p-1 z-10 right-3 justify-center items-center gap-2 inline-flex">
        <button
          className="bg-[#28282a] text-white px-3 py-2 rounded-xl hover:bg-gray-900 transition flex items-center space-x-2 group"
          style={{ userSelect: "none", cursor: "not-allowed" }}
          disabled
        >
          <Image src="/assets/chat.svg" alt="메시지 아이콘" width={20} height={20} className="w-5 h-5" />
          <span className=" text-[#c4c4c4] text-xs font-semibold font-['Pretendard'] leading-none">
            대화 신청하기
          </span>

          {/* 말풍선 */}
          <div className="absolute top-[100%] s:left-[50%] left-[65%] transform -translate-x-1/2 min-w-[140px] px-3 py-2 bg-[orange] text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              현재 개발 중인 <br /> 기능 입니다.
            <div className="absolute top-[-6px] s:left-[70%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[orange] rotate-45"></div>
          </div>
        </button>
      </div>

      {/* 대표 포트폴리오 이미지 */}
      <div className="relative mb-4">
        <div
          className="w-full h-40 bg-gray-300 rounded-t-[20px] overflow-hidden cursor-pointer group"
          onClick={() => window.open(blog, "_blank")}
          style={{ userSelect: "none" }}
        >
          <Image
            src={background_image_url ? versionedBackgroundImage : "/logos/defaultBackgroundImage.svg"}
            alt="포트폴리오"
            width={300}
            height={160}
            quality={80}
            priority
            className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      </div>

      {/* 프로필 이미지 */}
      <div 
       className="w-30 h-30 rounded-2xl flex items-center justify-center ml-1 bg-black absolute bottom-[190px] left-4 overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
       onClick={onOpenProfile}
       style={{ userSelect: "none" }}
      >
        <div className="relative w-[60px] h-[60px]">
          <Image
            key={versionedProfileImage}
            src={versionedProfileImage}
            alt={nickname}
            width={120}
            height={120}
            quality={90}
            priority
            className="object-cover w-full h-full rounded-2xl shadow-lg bg-black"
          />
        </div>
      </div>

      {/* 멤버 정보 */}
      <div className="self-stretch pl-4 h-[234px] flex-col justify-start items-start gap-2 ml-1 flex mt-[-40px]">
        <div className="self-stretch h-[129px] flex-col justify-start items-start cursor-pointer gap-3 flex" onClick={onOpenModal}>
          <div className="self-stretch justify-between items-center inline-flex">
            <div className="h-[57px] flex-col justify-start items-start gap-2 inline-flex">
              {/* 사용자의 닉네임 */}
              <div className="text-center text-[#f7f7f7] text-xl font-medium font-['Pretendard'] leading-7">{nickname}</div>
              
              {/* 직업 제목과 경력 */}
              <div className="text-primary text-sm font-normal font-['Pretendard'] leading-[21px]">
                {job_title}
                <span className="text-sm font-normal font-['Pretendard'] leading-[21px]">
                  &nbsp; |&nbsp; {experience}
                </span>
              </div>
              
              {/* 자기소개 */}
              <div className="self-stretch h-[41px] text-[#f7f7f7] text-sm font-normal font-['Pretendard'] leading-[21px]">
                {description.length > 30 ? `${description.substring(0, 30)}...` : description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 포트폴리오 링크 */}
      <div className="absolute bottom-0 left-4 flex justify-start space-x-2 pb-4" style={{ userSelect: "none" }}>
        {/* 대표 포트폴리오 링크 */}
        <div className="self-stretch h-8 justify-start items-center gap-2 inline-flex">
          <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
            <div className="w-6 h-6 p-1 justify-center items-center flex">
              <Link
                href={blog || "#"} 
                target="_blank"
                className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-105 hover:rotate-3"
                style={{ userSelect: "none" }}
              >
                <Image
                  src="/Link/link.svg" 
                  alt="포트폴리오"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* 첫 번째 링크 */}
          <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
            <div className="w-6 h-6 p-1 justify-center items-center flex">
              <Link
                href={first_link ?? "#"}
                target="_blank"
                className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
                style={{ userSelect: "none" }}
              >
                <Image
                  src={first_link_type ? `/Link/${first_link_type}.svg` : "/Link/link.svg"}
                  alt="첫 번째 링크"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  loading= "lazy"
                />
              </Link>
            </div>
          </div>
          {/* 두 번째 링크 */}
          <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
            <div className="w-6 h-6 p-1 justify-center items-center flex">
              <Link
                href={second_link ?? "#"}
                target="_blank"
                className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
                style={{ userSelect: "none" }}
              >
                <Image
                  src={second_link_type ? `/Link/${second_link_type}.svg` : "/Link/link.svg"} // secondLinkType에 따른 아이콘
                  alt="두 번째 링크"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  loading= "lazy"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardUI;