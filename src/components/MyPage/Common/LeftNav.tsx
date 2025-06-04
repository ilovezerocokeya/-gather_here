"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserStore } from '@/stores/useUserStore';
import { secureImageUrl } from "@/utils/Image/imageUtils";
import LeftNavLoader from "@/components/Common/Skeleton/LeftNavLoader";

const defaultImage = "/assets/header/user.svg";

const LeftNav = () => {
  const { user } = useAuth(); 
  const { userData, loading, profileImageUrl, imageVersion, fetchUserData } = useUserStore();
  const pathname = usePathname();
  const profileImage = `${secureImageUrl(profileImageUrl ?? defaultImage)}?v=${imageVersion}`; // 프로필 이미지에 캐시 무효화를 위한 버전 쿼리 추가

  // user가 존재할 경우 전역 유저 데이터 패칭
  useEffect(() => {
    if (user?.id) {
      void fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  return (
    <aside className="sticky top-0 p-6 s:p-0 w-[250px] max-h-[600px] flex flex-col items-start gap-3 rounded-[20px] bg-fillStrong text-fontWhite shadow-sm s:hidden">
      {/* 유저 정보 로딩 중이면 스켈레톤 표시 */}
      {loading ? (
        <LeftNavLoader />
      ) : userData ? (
        <>
          {/* 유저 정보 표시 */}
          <div className="flex flex-col items-center gap-3 mb-1 pb-5 w-full border-b border-labelAssistive">
            <div className="w-48 h-48 rounded-[12px] bg-fillLight flex justify-center items-center relative">
              <Image
                key={profileImage}
                src={profileImage}
                alt="프로필 이미지"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1068px) 100vw"
                className="rounded-[12px] object-cover"
              />
            </div>
            <div className="text-center mt-2">
              {/* 닉네임 강조 */}
              <p className="text-primary text-base font-semibold">{userData.nickname}</p> 
              {/* 직군 색상 강조 + 연차는 보조 정보 */}
              <p className="text-sm text-labelAssistive mt-1">
                <span
                  className={`
                    ${userData.job_title === "프론트엔드" ? "text-primary" : ""}
                    ${userData.job_title === "백엔드" ? "text-accentOrange" : ""}
                    ${userData.job_title === "IOS" ? "text-accentMaya" : ""}
                    ${userData.job_title === "안드로이드" ? "text-accentPurple" : ""}
                    ${userData.job_title === "데브옵스" ? "text-accentRed" : ""}
                    ${userData.job_title === "디자이너" ? "text-accentMint" : ""}
                    ${userData.job_title === "PM" ? "text-accentColumbia" : ""}
                    ${userData.job_title === "기획자" ? "text-accentPink" : ""}
                    ${userData.job_title === "마케터" ? "text-accentYellow" : ""}
                  `}
                >
                  {userData.job_title}
                </span>
                <span className="px-1 text-labelAssistive">|</span>
                <span>{userData.experience}</span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-fillStrong">사용자 정보 없음</div>
      )}
      <nav>
        <ul className="w-full">
          {/* 프로필 관리 */}
          <li className="mb-3 ml-8">
            <span className="block w-full text-lg text-labelNeutral font-baseBold">프로필 관리</span>
            <ul className="ml-8 mt-2">
              <li className="mb-2">
                <Link
                  href="/mypage"
                  className={`block w-full md:hover:text-primary ${
                    pathname === "/mypage" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  기본 프로필
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/mypage/hubprofile"
                  className={`block w-full md:hover:text-primary ${
                    pathname === "/mypage/hubprofile" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  허브 프로필
                </Link>
              </li>
            </ul>
          </li>

          {/* 북마크 관리 */}
          <li className="mb-3 ml-8">
            <span className="block w-full text-lg text-labelNeutral font-baseBold">북마크 관리</span>
            <ul className="ml-8 mt-2">
              <li className="mb-2">
                <Link
                  href="/mypage/myinterests"
                  className={`block w-full md:hover:text-primary ${
                    pathname === "/mypage/myinterests" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  내 관심 글
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/mypage/mypeople"
                  className={`block w-full md:hover:text-primary ${
                    pathname === "/mypage/mypeople" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  내 관심 멤버
                </Link>
              </li>
            </ul>
          </li>

          {/* 작성 글 */}
          <li className="mb-3 ml-8">
            <Link
              href="/mypage/myposts"
              className={`block w-full text-lg md:hover:text-primary ${
                pathname === "/mypage/myposts" ? "text-primary font-baseBold" : "text-labelNeutral"
              }`}
            >
              내 작성 글
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default LeftNav;