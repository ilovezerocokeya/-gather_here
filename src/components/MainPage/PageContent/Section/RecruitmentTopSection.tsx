"use client";

import React from "react";
import Carousel from "@/components/MainPage/Carousel/Carousel";
import FilterBar from "@/components/MainPage/FilterBar/FilterBar";
import { PostWithUser } from "@/types/posts/Post.type";
import Image from "next/image";

interface RecruitmentTopSectionProps {
  initialCarouselPosts: PostWithUser[];
  selectedPosition: string;
  selectedPlace: string;
  selectedLocation: string;
  selectedDuration: number | null;
  onChange: (
    position: string,
    place: string,
    location: string,
    duration: number | null
  ) => void;
}

const RecruitmentTopSection: React.FC<RecruitmentTopSectionProps> = ({
  initialCarouselPosts,
  selectedPosition,
  selectedPlace,
  selectedLocation,
  selectedDuration,
  onChange,
}) => {
  return (
    <>
      {/* 모집 마감 안내 */}
      <div className="flex items-center">
        <Image src="/assets/gif/run.webp" alt="Run Icon" width={20} height={20} className="w-5 h-5 mb-2" priority />
        <p className="m-2 mb-4 text-labelNormal">모집이 곧 종료돼요</p>
      </div>

      {/* 캐러셀 */}
      <Carousel posts={initialCarouselPosts} />

      {/* 필터 안내 */}
      <div className="flex items-center mt-7">
        <Image src="/assets/gif/puzzle.webp" alt="Puzzle Icon" width={20} height={20} className="mb-3" />
        <p className="ml-2 mb-3 text-labelNormal">나에게 꼭 맞는 동료들을 찾아보세요</p>
      </div>

      {/* 필터바 */}
      <FilterBar
        selectedPosition={selectedPosition}
        selectedPlace={selectedPlace}
        selectedLocation={selectedLocation}
        selectedDuration={selectedDuration}
        onChange={onChange}
      />
    </>
  );
};

export default RecruitmentTopSection;