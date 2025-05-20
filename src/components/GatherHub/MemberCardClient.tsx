'use client';

import React, { useState, useMemo } from 'react';
import CardModalClient from './CardModalClient';
import { MemberType } from '@/lib/gatherHub';
import { useLikeStore } from '@/stores/useLikeStore';
import { useUserStore } from '@/stores/useUserStore';
import { techStacks } from '@/lib/generalOptionStacks';
import { stripQuery, secureImageUrl } from '@/utils/Image/imageUtils';

const MemberCardClient: React.FC<MemberType> = ({
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
  const { likedMembers, toggleLike } = useLikeStore();
  const { userData, imageVersion } = useUserStore();

  const currentUserId = userData?.user_id;
  const liked = likedMembers[user_id] || false;
  const isMyCard = currentUserId === user_id;

  const handleToggleLike = () => {
    if (!currentUserId) return;
    void toggleLike(user_id, currentUserId);
  };

  const selectedTechStacks = useMemo(() => {
    if (!tech_stacks) return [];
    return techStacks.filter((stack) => tech_stacks.includes(stack.id));
  }, [tech_stacks]);

  const versionedProfileImage = useMemo(() => {
    const base = stripQuery(secureImageUrl(profile_image_url));
    return isMyCard ? `${base}?v=${imageVersion}` : base;
  }, [profile_image_url, imageVersion, isMyCard]);

  const versionedBackgroundImage = useMemo(() => {
    const base = stripQuery(secureImageUrl(background_image_url));
    return isMyCard ? `${base}?v=${imageVersion}` : base;
  }, [background_image_url, imageVersion, isMyCard]);

  return (
    <CardModalClient
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
      selectedTechStacks={selectedTechStacks}
      imageVersion={imageVersion}
      tech_stacks={tech_stacks}
    />
  );
};

export default MemberCardClient;