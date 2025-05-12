"use client";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head"; 
import { stripQuery } from "@/utils/Image/imageUtils";
import { CardUIProps } from "@/lib/gatherHub";

const CardUIClient: React.FC<CardUIProps> = ({
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
  imageVersion,
  priority
}) => {
  // 프로필/배경 이미지에 캐시 무효화를 위한 버전 적용
  const versionedProfileImage = `${stripQuery(secureImageUrl(profile_image_url))}?v=${imageVersion ?? 0}`;
  const versionedBackgroundImage = `${stripQuery(secureImageUrl(background_image_url))}?v=${imageVersion ?? 0}`;

  // 기본 welcome 이미지 여부 판별
  const isFallbackImage = stripQuery(versionedBackgroundImage).includes("welcomeImage.svg");

  return (
    <>
      {/* 이미지 우선 로딩을 위한 preload 설정 */}
      {priority && !isFallbackImage && (
        <Head>
          <link
            rel="preload"
            as="image"
            href={versionedBackgroundImage}
          />
        </Head>
      )}

      <div
        className="member-card bg-fillStrong rounded-[20px] shadow-lg relative w-[290px] h-96 flex-col user-select-none justify-start items-center gap-[78px] inline-flex"
        style={{ userSelect: "none" }}
      >
        {/* 좋아요 버튼 */}
        <div className="absolute top-3 right-3 z-10 flex">
          <button
            onClick={handleToggleLike}
            className="p-1 rounded-[9px] bg-[#141415] border border-[#2d2d2f] shadow-lg transition-transform duration-200 hover:scale-110"
            style={{ userSelect: "none" }}
          >
            <Image
              src={liked ? "/assets/bookmark2.svg" : "/assets/bookmark1.svg"}
              alt="좋아요"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* 메시지 버튼 */}
        <div className="absolute bottom-[200px] right-3 p-1 z-10 inline-flex">
          <button
            disabled
            className="bg-[#28282a] text-white px-3 py-2 rounded-xl hover:bg-gray-900 transition group"
            style={{ cursor: "not-allowed" }}
          >
            <Image src="/assets/chat.svg" alt="메시지 아이콘" width={20} height={20} />
            <span className="text-[#c4c4c4] text-xs font-semibold ml-2">대화 신청하기</span>
            {/* 말풍선 툴팁 */}
            <div className="absolute top-[100%] left-[65%] s:left-[50%] transform -translate-x-1/2 min-w-[140px] px-3 py-2 bg-[orange] text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              현재 개발 중인 <br /> 기능 입니다.
              <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[orange] rotate-45"></div>
            </div>
          </button>
        </div>

        {/* 대표 포트폴리오 이미지 */}
        <div className="relative mb-4">
          <Link
            href={blog || "#"}
            target="_blank"
            className="w-full h-40 bg-gray-300 rounded-t-[20px] overflow-hidden block"
          >
            <Image
              key={versionedBackgroundImage}
              src={versionedBackgroundImage}
              alt={`${nickname}님의 대표 포트폴리오 이미지`}
              width={300}
              height={160}
              quality={80}
              priority={background_image_url && !background_image_url.includes("welcomeImage.svg") ? priority : false}
              fetchPriority="high"
              sizes="(max-width: 768px) 90vw, 300px"
              className="object-cover"
            />
          </Link>
        </div>

        {/* 프로필 이미지 */}
        <div 
          className="w-30 h-30 rounded-2xl flex items-center justify-center ml-1 bg-black absolute bottom-[190px] left-4 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          onClick={onOpenProfile}
        >
          <div className="relative w-[60px] h-[60px]">
            <Image
              key={versionedProfileImage}
              src={versionedProfileImage}
              alt={`${nickname}님의 프로필 사진`}
              width={120}
              height={120}
              quality={90}
              loading="lazy"
              sizes="(max-width: 768px) 20vw, 60px"
              className="object-cover w-full h-full rounded-2xl shadow-lg bg-black"
            />
          </div>
        </div>

        {/* 닉네임, 직군, 경력, 자기소개 영역 */}
        <div className="self-stretch pl-4 h-[234px] flex flex-col gap-2 ml-1 mt-[-40px]">
          <div className="h-[129px] flex flex-col gap-3 cursor-pointer" onClick={onOpenModal}>
            <div className="flex justify-between items-center">
              <div className="h-[57px] flex flex-col gap-2">
                <div className="text-[#f7f7f7] text-xl font-medium">{nickname}</div>
                <div className="text-primary text-sm">
                  {job_title} <span className="text-sm">&nbsp;|&nbsp; {experience}</span>
                </div>
                <div className="text-[#f7f7f7] text-sm">
                  {description.length > 30 ? `${description.substring(0, 30)}...` : description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 포트폴리오 외부 링크 아이콘들 */}
        <div className="absolute bottom-0 left-4 flex space-x-2 pb-4">
          {[blog, first_link, second_link].map((url, idx) => {
            const type = [null, first_link_type, second_link_type][idx];
            const icon = type ? `/Link/${type}.svg` : "/Link/link.svg";
            return (
              <div key={idx} className="p-1 bg-[#28282a] rounded-[9px] flex items-center">
                <div className="w-6 h-6 p-1 flex items-center justify-center">
                  <Link
                    href={url ?? "#"}
                    target="_blank"
                    className="transition-transform duration-300"
                  >
                    <Image src={icon} alt={`링크${idx + 1}`} width={24} height={24} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CardUIClient;