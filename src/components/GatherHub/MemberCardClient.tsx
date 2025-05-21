// 'use client';

// import React, { useState, useMemo, useEffect } from 'react';
// import CardModalClient from './CardModalClient';
// import { MemberType } from '@/lib/gatherHub';
// import { useLikeStore } from '@/stores/useLikeStore';
// import { useUserStore } from '@/stores/useUserStore';
// import { techStacks } from '@/lib/generalOptionStacks';
// import { stripQuery, secureImageUrl } from '@/utils/Image/imageUtils';
// import { useToastStore } from '@/stores/useToastStore';

// const MemberCardClient: React.FC<MemberType> = ({
//   user_id,
//   nickname,
//   job_title,
//   experience,
//   description,
//   background_image_url,
//   profile_image_url,
//   blog,
//   answer1,
//   answer2,
//   answer3,
//   first_link_type,
//   first_link,
//   second_link_type,
//   second_link,
//   tech_stacks,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { likedMembers, toggleLike, hydrate, syncLikesWithServer } = useLikeStore();
//   const { userData, imageVersion } = useUserStore();
//   const { showToast } = useToastStore();
//   const currentUserId = userData?.user_id;
//   const isMyCard = currentUserId === user_id;
//   const liked = !!likedMembers[user_id];

//   // 좋아요 상태 동기화 (서버 및 로컬)
//   useEffect(() => {
//     if (!currentUserId) return;
//     hydrate(currentUserId); // 1. 로컬에서 먼저 불러오고
//     void syncLikesWithServer(currentUserId); // 2. 서버와 동기화
//   }, [currentUserId]);

//   const handleToggleLike = () => {
//   if (!currentUserId) {
//     showToast("로그인이 필요합니다.", "error");
//     return;
//   }
//   void toggleLike(user_id, currentUserId);
// };

//   const selectedTechStacks = useMemo(() => {
//     if (!tech_stacks) return [];
//     return techStacks.filter((stack) => tech_stacks.includes(stack.id));
//   }, [tech_stacks]);

//   const versionedProfileImage = useMemo(() => {
//     const base = stripQuery(secureImageUrl(profile_image_url));
//     return isMyCard ? `${base}?v=${imageVersion}` : base;
//   }, [profile_image_url, imageVersion, isMyCard]);

//   const versionedBackgroundImage = useMemo(() => {
//     const base = stripQuery(secureImageUrl(background_image_url));
//     return isMyCard ? `${base}?v=${imageVersion}` : base;
//   }, [background_image_url, imageVersion, isMyCard]);

//   return (
//     <CardModalClient
//       isModalOpen={isModalOpen}
//       closeModal={() => setIsModalOpen(false)}
//       nickname={nickname}
//       job_title={job_title}
//       experience={experience}
//       description={description}
//       profile_image_url={versionedProfileImage}
//       background_image_url={versionedBackgroundImage}
//       blog={blog}
//       liked={liked}
//       answer1={answer1}
//       answer2={answer2}
//       answer3={answer3}
//       first_link_type={first_link_type}
//       first_link={first_link}
//       second_link_type={second_link_type}
//       second_link={second_link}
//       handleToggleLike={handleToggleLike}
//       selectedTechStacks={selectedTechStacks}
//       imageVersion={imageVersion}
//       tech_stacks={tech_stacks}
//     />
//   );
// };

// export default MemberCardClient;