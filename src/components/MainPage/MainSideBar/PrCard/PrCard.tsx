"use client";

import React, { useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLikeStore } from "@/stores/useLikeStore";
import { useUserData } from "@/provider/user/UserDataProvider";
import { fetchMembers } from "@/utils/fetchMembers";
import { MemberCardProps, MemberType } from "@/lib/gatherHub";
import CardUI from "@/components/GatherHub/CardUI";
import CardModal from "@/components/GatherHub/CardModal";
import { techStacks } from "@/lib/techStacks";
import { secureImageUrl } from "@/utils/imageUtils";
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import CardSkeleton from "@/components/Common/Skeleton/CardSkeleton";

const PrCard: React.FC = () => {

  // SEO 메타 태그
  const metaTitle = "GatherHub - 개발자 PR 카드";
  const metaDescription = "프론트엔드 개발자들이 자신의 기술 스택과 경력을 홍보하는 PR 카드 시스템";
  const metaUrl = "https://gatherhub.com";
  const metaImage = "https://gatherhub.com/assets/images/gatherhub-thumbnail.jpg";

  // 슬라이더 설정
  const settings = {
    infinite: true, // 무한 루프 활성화
    speed: 600, // 슬라이드 전환 속도 (ms)
    slidesToShow: 1, // 한 번에 표시할 슬라이드 개수
    slidesToScroll: 1, // 한 번에 이동할 슬라이드 개수
    autoplay: true, // 자동 재생 활성화
    autoplaySpeed: 4000, // 자동 전환 속도 (ms)
    arrows: false, // 화살표 버튼 비활성화
    lazyLoad: "progressive" as const,// 슬라이드 이미지 로딩 최적화
    pauseOnHover: true, // 사용자 경험 개선
  };

  // Zustand 상태 관리에서 좋아요 정보 가져오기
  const { likedMembers, toggleLike } = useLikeStore();

  // 현재 로그인한 사용자 정보 가져오기
  const { userData } = useUserData();

  // 모달 상태 관리
  const [selectedMember, setSelectedMember] = useState<MemberCardProps | null>(null);

  // 좋아요 토글 함수
  const handleToggleLike = async (userId: string) => {
    if (!userData?.user_id) {
      alert("로그인이 필요합니다."); // UI 알림 추가
      return;
    }
  
    try {
      await toggleLike(userId, userData.user_id);
    } catch (error) {
      alert("좋아요 처리 중 오류 발생"); // UI 알림 추가
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };

  // React Query를 사용하여 데이터 가져오기 (무한 스크롤 방식)
  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ["members"], 
    queryFn: ({ pageParam = 1 }) => fetchMembers(pageParam),
    getNextPageParam: (lastPage) => (lastPage?.nextPage ? lastPage.nextPage : undefined), // 안정성 추가
    initialPageParam: 1,
  });

  // 가져온 멤버 데이터를 슬라이드에 사용할 형태로 변환
  const slides = useMemo<MemberType[]>(() => {
    if (!data) return []; // 데이터가 없을 경우 빈 배열 반환
    return data.pages.flatMap((page) => page.members).slice(0, 10); // 최대 10개의 멤버만 슬라이드에 표시
  }, [data, likedMembers]);

  // 데이터 로딩 중일 경우 로딩 메시지 표시
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <CardSkeleton />
      </div>
    );
  }

  // 데이터 로드 실패 시 에러 메시지 표시
  if (isError) return <p>Error loading data...</p>;

  return (
    <div className="w-auto h-auto rounded-2xl my-3">
      {/* SEO 메타 태그 추가 */}
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="프론트엔드, 개발자, GatherHub, PR 카드, 기술 스택" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:url" content={metaUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
      </Head>

      {/* JSON-LD 추가 */}
      <Script type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": metaTitle,
          "description": metaDescription,
          "url": metaUrl,
          "image": metaImage,
          "publisher": {
            "@type": "Organization",
            "name": "GatherHub",
            "logo": {
              "@type": "ImageObject",
              "url": "https://gatherhub.com/assets/images/logo.png"
            }
          }
        })}
      </Script>

      {/* 섹션 제목 */}
      <h2 className="flex items-center my-3 text-labelNormal">
        <Image 
          src="/assets/gif/mic.webp" 
          alt="마이크 아이콘" 
          width={20} 
          height={20} 
          className="mr-1" 
          priority
          fetchPriority="high"
        />
        자랑스러운 게더_멤버들을 소개할게요
      </h2>

      {/* 슬라이더 */}
      <div className="flex justify-center">
        <Slider {...settings} className="w-full max-w-[680px] flex justify-center">
          {slides.map((member) => {
            const liked = likedMembers?.[member.user_id] || false; // 현재 멤버의 좋아요 상태 확인
          
            return (
              <div key={member.user_id} className="flex justify-center px-4">
                <CardUI
                  {...member}
                  liked={liked}
                  handleToggleLike={() => void handleToggleLike(member.user_id)}
                  secureImageUrl={secureImageUrl}
                  onOpenModal={() => setSelectedMember(member)}
                />
              </div>
            );
          })}
        </Slider>
      </div>
      

      {/* 모달 */}
      {selectedMember && (
        <CardModal
          isModalOpen={!!selectedMember} // 모달이 열려 있는지 확인
          closeModal={() => setSelectedMember(null)} // 모달 닫기 함수
          {...selectedMember} // 선택된 멤버의 정보 전달
          handleToggleLike={() => void handleToggleLike(selectedMember.user_id)}
          secureImageUrl={secureImageUrl}
          selectedTechStacks={techStacks.filter((stack) =>
            selectedMember.tech_stacks?.includes(stack.id)
          )}
        />
      )}
    </div>
  );
};

export default PrCard;