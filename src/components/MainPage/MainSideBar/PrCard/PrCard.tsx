"use client";

import React, { useMemo, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLikeStore } from "@/stores/useLikeStore";
import { useUserStore } from '@/stores/useUserStore';
import { fetchMembers } from "@/utils/fetchMembers";
import { MemberType } from "@/lib/gatherHub";
import CardUIServer from "@/components/GatherHub/CardUIServer";
import CardModalServer from "@/components/GatherHub/CardModalServer";
import { techStacks } from "@/lib/generalOptionStacks";
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import CardSkeleton from "@/components/Common/Skeleton/CardSkeleton";
import { useToastStore } from "@/stores/useToastStore";


const PrCard: React.FC = () => {

  // SEO 메타 태그
  const metaTitle = "GatherHub - 개발자 PR 카드";
  const metaDescription = "프론트엔드 개발자들이 자신의 기술 스택과 경력을 홍보하는 PR 카드 시스템";
  const metaUrl = "https://gatherhub.com";
  const metaImage = "https://gatherhub.com/assets/images/gatherhub-thumbnail.jpg";

  // 슬라이더 설정
  const settings = {
    infinite: true,
    speed: 600, 
    slidesToShow: 1, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    lazyLoad: "progressive" as const,
    pauseOnHover: true,
  };
  const { likedMembers, toggleLike } = useLikeStore(); 
  const { userData } = useUserStore(); 
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const { showToast } = useToastStore();
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
  let observer: MutationObserver | null = null;

  const timeoutId = setTimeout(() => {
    const fixClonedSlideFocus = () => {
      const clonedSlides = document.querySelectorAll(".slick-slide[aria-hidden='true']");
      clonedSlides.forEach((slide) => {
        const focusables = slide.querySelectorAll("a, button, input, select, textarea");
        focusables.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.tabIndex !== -1) {
            htmlEl.setAttribute("tabIndex", "-1");
          }
        });
      });
    };

    fixClonedSlideFocus();

    observer = new MutationObserver(() => fixClonedSlideFocus());
    const slickList = document.querySelector(".slick-list");

    if (slickList) {
      observer.observe(slickList, { childList: true });
    }
  }, 1500);

  return () => {
    clearTimeout(timeoutId);
    if (observer) {
      observer.disconnect();
    }
  };
}, []);


  // 좋아요 토글 함수
  const handleToggleLike = async (userId: string) => {
  if (isToggling) return;

  if (!userData?.user_id) {
    showToast("로그인이 필요합니다.", "error");
    return;
  }

  try {
    setIsToggling(true); // 클릭 방지 시작
    await toggleLike(userId, userData.user_id);
  } catch (error) {
    showToast("좋아요 처리 중 오류가 발생했어요.", "error");
    console.error("좋아요 오류:", error);
  } finally {
    setIsToggling(false); // 클릭 방지 해제
  }
};

  // React Query를 사용하여 데이터 가져오기
  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ["members"], 
    queryFn: ({ pageParam = 1 }) => fetchMembers(pageParam),
    getNextPageParam: (lastPage) => (lastPage?.nextPage ? lastPage.nextPage : undefined), // 안정성 추가
    initialPageParam: 1,
  });

  // 가져온 멤버 데이터를 슬라이드에 사용할 형태로 변환
  const slides = useMemo<MemberType[]>(() => {
    if (!data) return [];
  
    const allMembers = data.pages.flatMap((page) => page.members);
  
    // 기본 이미지가 아닌 멤버들을 먼저 정렬
    const withRealImage = allMembers.filter(
      (m) => m.background_image_url && !m.background_image_url.includes("welcomeImage.svg")
    );
    const withDefaultImage = allMembers.filter(
      (m) => !m.background_image_url || m.background_image_url.includes("welcomeImage.svg")
    );
  
    // 최대 10개로 제한
    return [...withRealImage, ...withDefaultImage].slice(0, 10);
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
      <h2 className="flex items-center my-3 text-labelNormal ml-4">
        <Image 
          src="/assets/gif/mic.webp" 
          alt="마이크 아이콘" 
          width={20} 
          height={20} 
          className="mr-1" 
        />
        자랑스러운 게더_멤버들을 소개할게요
      </h2>

      {/* 슬라이더 */}
      <div className="flex justify-center">
        <Slider {...settings} className="w-full max-w-[680px] flex justify-center">
          {slides.map((member, index) => {
            const liked = likedMembers?.[member.user_id] || false;
          
            return index === 0 ? (
              <div
                key={member.user_id}
                className="flex justify-center px-4"
                suppressHydrationWarning // SSR에서 우선 렌더되는 이미지에 중요
              >
                <CardUIServer
                  {...member}
                  liked={liked}
                  handleToggleLike={() => void handleToggleLike(member.user_id)}
                  onOpenModal={() => setSelectedMember(member)}
                  priority={true}
                />
              </div>
            ) : (
              <div key={member.user_id} className="flex justify-center px-4">
                <CardUIServer
                  {...member}
                  liked={liked}
                  handleToggleLike={() => void handleToggleLike(member.user_id)}
                  onOpenModal={() => setSelectedMember(member)}
                  priority={false}
                />
              </div>
            );
          })}
        </Slider>
      </div>
      

      {/* 모달 */}
      {selectedMember && (
        <CardModalServer
          isModalOpen={!!selectedMember} // 모달이 열려 있는지 확인
          closeModal={() => setSelectedMember(null)} // 모달 닫기 함수
          {...selectedMember} // 선택된 멤버의 정보 전달
          handleToggleLike={() => void handleToggleLike(selectedMember.user_id)}
          selectedTechStacks={techStacks.filter((stack) =>
            selectedMember.tech_stacks?.includes(stack.id)
          )}
        />
      )}

    </div>
  );
};

export default PrCard;