"use client";
import React, { useState, useMemo } from "react";
import { useLikeStore } from "@/stores/useLikeStore";
import { useUserStore } from '@/stores/useUserStore';
import CardUI from "./CardUI"; 
import CardModal from "./CardModal";
import Toast from "@/components/Common/Toast/Toast";
import ProfileExtend from "./ProfileExtend"; 
import { MemberCardProps } from "@/lib/gatherHub";
import { techStacks } from "@/lib/techStacks";
import { stripQuery } from "@/utils/Image/imageUtils";
import { secureImageUrl } from "@/utils/Image/imageUtils";

const MemberCard: React.FC<MemberCardProps> = ({
  user_id,
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
  tech_stacks,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    state: "success" | "error" | "warn" | "info" | "custom";
    message: string;
  } | null>(null);

  const { likedMembers, toggleLike } = useLikeStore(); // 좋아요 상태 관리
  const { userData, imageVersion } = useUserStore(); // 현재 로그인 유저 정보

  const currentUserId = userData?.user_id;
  const isMyCard = currentUserId === user_id; // 해당 카드가 본인의 카드인지 여부
  const liked = likedMembers[user_id] || false; // 현재 카드가 좋아요 되어 있는지 여부

  // 좋아요 토글 핸들러
  const handleToggleLike = () => {
    if (!currentUserId) {
      setToast({ state: "error", message: "로그인이 필요합니다." });
      return;
    }

    void toggleLike(user_id, currentUserId);
  };

  // 기술 스택 ID 목록을 실제 스택 객체 배열로 변환
  const selectedTechStacks = useMemo(() => {
    if (!tech_stacks) return [];
    return techStacks.filter((stack) => tech_stacks.includes(stack.id));
  }, [tech_stacks]);

  // 본인 카드인 경우 캐시 무효화를 위해 버전 쿼리스트링을 붙인 프로필 이미지 URL 생성
  const versionedProfileImage = useMemo(() => {
    const base = stripQuery(secureImageUrl(profile_image_url));
    return isMyCard ? `${base}?v=${imageVersion}` : base;
  }, [profile_image_url, imageVersion, isMyCard]);
  
  // 본인 카드인 경우 캐시 무효화를 위해 버전 쿼리스트링을 붙인 배경 이미지 URL 생성
  const versionedBackgroundImage = useMemo(() => {
    const base = stripQuery(secureImageUrl(background_image_url));
    return isMyCard ? `${base}?v=${imageVersion}` : base;
  }, [background_image_url, imageVersion, isMyCard]);

  return (
    <>
      <CardUI
        nickname={nickname}
        job_title={job_title}
        experience={experience}
        description={description}
        background_image_url={versionedBackgroundImage}
        profile_image_url={versionedProfileImage}
        blog={blog}
        first_link_type={first_link_type}
        first_link={first_link}
        second_link_type={second_link_type}
        second_link={second_link}
        liked={liked}
        handleToggleLike={handleToggleLike}
        secureImageUrl={secureImageUrl}
        onOpenModal={() => setIsModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        imageVersion={imageVersion}
      />

      <CardModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        nickname={nickname}
        job_title={job_title}
        experience={experience}
        description={description}
        profile_image_url={versionedProfileImage}
        background_image_url={versionedBackgroundImage}
        blog={blog}
        liked={liked}
        answer1={answer1}
        answer2={answer2}
        answer3={answer3}
        first_link_type={first_link_type}
        first_link={first_link}
        second_link_type={second_link_type}
        second_link={second_link}
        handleToggleLike={handleToggleLike}
        secureImageUrl={secureImageUrl}
        selectedTechStacks={selectedTechStacks}
        imageVersion={imageVersion}
      />

      <ProfileExtend
        isOpen={isProfileModalOpen}
        closeModal={() => setIsProfileModalOpen(false)}
        profileImageUrl={versionedProfileImage}
        nickname={nickname}
        secureImageUrl={secureImageUrl}
        imageVersion={imageVersion}
      />
      {toast && (
        <Toast
          state={toast.state}
          message={toast.message}
          onClear={() => setToast(null)}
        />
      )}
    </>
  );
};

export default MemberCard;