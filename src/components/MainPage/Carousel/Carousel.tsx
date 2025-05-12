"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/components/MainPage/Carousel/Carousel.css";
import { Navigation, Pagination, A11y } from "swiper/modules";
import PostCardShort from "@/components/Common/Card/PostCard/PostCardShort";
import { PostWithUser } from "@/types/posts/Post.type";

interface CarouselProps {
  posts: PostWithUser[]; // 전체 모집글 리스트
}

const Carousel: React.FC<CarouselProps> = ({ posts }) => {
  // 모집글이 없을 경우 안내 메시지 출력
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-white py-8">
        현재 마감 임박한 모집글이 없습니다.
      </div>
    );
  }

  // 오늘 날짜 기준으로 자정 설정
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 마감일까지 0~8일 이내인 모집글 필터링
  const filteredPosts = posts.filter((post) => {
    if (!post.deadline) return false;

    const deadlineDate = new Date(post.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 8;
  });

  // 필터링된 모집글이 없는 경우
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center text-white py-8">
        현재 마감 임박한 모집글이 없습니다.
      </div>
    );
  }

  return (
    <div className="relative z-0">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={12}
        slidesPerView={3}
        navigation
        loop={true}
        pagination={{ clickable: true }}
        className="w-full swiper"
        breakpoints={{
          280: { slidesPerView: 1 },
          336: { slidesPerView: 1 },
          769: { slidesPerView: 3 },
          1068: { slidesPerView: 3 },
        }}
      >
        {filteredPosts.map((post, index) => (
          <SwiperSlide key={`${post.post_id}_${index}`} className="flex justify-center items-center">
            <PostCardShort post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;