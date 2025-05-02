"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserStore } from '@/stores/useUserStore';
import { secureImageUrl } from "@/utils/Image/imageUtils";
import LeftNavLoader from "@/components/Common/Skeleton/LeftNavLoader";
import { jobTitleClassMap } from "@/lib/postFormOptions";

const defaultImage = "/assets/header/user.svg";

const getJobTitleClass = (job_title: string) => {
  const lower = job_title?.toLowerCase() ?? "";
  return (
    Object.entries(jobTitleClassMap).find(([key]) => lower.includes(key.toLowerCase()))?.[1] || ""
  );
};

const LeftNav = () => {
  const { user } = useAuth(); // 인증된 유저 정보 가져오기
  const { userData, loading, profileImageUrl, imageVersion, fetchUserData } = useUserStore();
  const pathname = usePathname(); // 현재 경로 확인
  
  // 프로필 이미지 URL에 버전을 붙여 캐시 무효화
  const resolvedImage = secureImageUrl(profileImageUrl ?? defaultImage);
  const profileImage = `${secureImageUrl(profileImageUrl ?? defaultImage)}?v=${imageVersion}`;

  // 유저 정보가 있을 경우 상태 초기화
  useEffect(() => {
    if (user?.id) {
      console.log("[LeftNav] fetchUserData triggered for user:", user.id);
      void fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  useEffect(() => {
    console.log("[LeftNav] ✅ userData.profile_image_url:", userData?.profile_image_url);
    console.log("[LeftNav] ✅ resolved secureImageUrl:", resolvedImage);
    console.log("[LeftNav] ✅ final profileImage (with version):", profileImage);
    console.log("[LeftNav] ✅ imageVersion:", imageVersion);
  }, [profileImageUrl, imageVersion]);

  const jobTitleClass = userData?.job_title ? getJobTitleClass(userData.job_title) : "";

  return (
    <aside className="sticky top-0 p-6 s:p-0 w-[250px] max-h-[540px] flex flex-col items-start gap-3 rounded-[20px] bg-fillStrong text-fontWhite shadow-sm s:hidden">
      {loading ? (
        <LeftNavLoader />
      ) : userData ? (
        <>
          <div className="flex flex-col items-center gap-3 mb-1 pb-5 w-full border-b border-labelAssistive">
            <div className="w-48 h-48 rounded-[12px] bg-fillLight flex justify-center items-center relative">
              <Image
                key={profileImage}
                src={profileImage}
                alt="프로필 이미지"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1068px) 100vw"
                className="rounded-[12px] object-cover"
                priority
              />
            </div>
            <ol className="flex text-xs leading-tight text-center text-labelStrong">
              <li className="font-baseBold">{userData.nickname}</li>
              <li className="px-2 text-labelAssistive">|</li>
              <li className={`${jobTitleClass}`}>
                <span className="pr-1">{userData.job_title}</span>
                <span className="text-labelAssistive px-1">|</span>
                <span>{userData.experience}</span>
              </li>
            </ol>
          </div>
        </>
      ) : (
        <div className="text-fillStrong">사용자 정보 없음</div>
      )}

      {/* 메뉴 */}
      <nav>
        <ul className="w-full">
          <li className="mb-3">
            <span className="block w-full text-lg text-labelNeutral font-baseBold">프로필 관리</span>
            <ul className="ml-4 mt-2">
              <li className="mb-2">
                <Link
                  href="/mypage"
                  className={`block w-full hover:text-primary ${
                    pathname === "/mypage" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  기본 프로필
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/mypage/hubprofile"
                  className={`block w-full hover:text-primary ${
                    pathname === "/mypage/hubprofile" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  허브 프로필
                </Link>
              </li>
            </ul>
          </li>

          <li className="mb-3">
            <span className="block w-full text-lg text-labelNeutral font-baseBold">북마크 관리</span>
            <ul className="ml-4 mt-2">
              <li className="mb-2">
                <Link
                  href="/mypage/myinterests"
                  className={`block w-full hover:text-primary ${
                    pathname === "/mypage/myinterests" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  내 관심 글
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/mypage/mypeople"
                  className={`block w-full hover:text-primary ${
                    pathname === "/mypage/mypeople" ? "text-primary font-baseBold" : "text-labelNeutral"
                  }`}
                >
                  내 관심 멤버
                </Link>
              </li>
            </ul>
          </li>

          <li className="mb-3">
            <Link
              href="/mypage/myposts"
              className={`block w-full text-lg hover:text-primary ${
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