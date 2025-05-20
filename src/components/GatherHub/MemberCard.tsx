// "use client";
// import React, { useState, useMemo } from "react";
// import { useLikeStore } from "@/stores/useLikeStore";
// import { useUserStore } from '@/stores/useUserStore';
// import CardUIServer from "./CardUIServer"; 
// import CardModalServer from "./CardModalServer";
// import { MemberType } from "@/lib/gatherHub";
// import { techStacks } from "@/lib/generalOptionStacks";
// import { stripQuery } from "@/utils/Image/imageUtils";
// import { secureImageUrl } from "@/utils/Image/imageUtils";

// const MemberCard: React.FC<MemberType> = ({
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
//   const { likedMembers, toggleLike } = useLikeStore(); 
//   const { userData, imageVersion } = useUserStore(); 
//   const currentUserId = userData?.user_id;
//   const isMyCard = currentUserId === user_id;
//   const liked = likedMembers[user_id] || false;

//   // 좋아요 토글 핸들러
//   const handleToggleLike = () => {
//     if (!currentUserId) {
//       return;
//     }

//     void toggleLike(user_id, currentUserId);
//   };

//   // 기술 스택 ID 목록을 실제 스택 객체 배열로 변환
//   const selectedTechStacks = useMemo(() => {
//     if (!tech_stacks) return [];
//     return techStacks.filter((stack) => tech_stacks.includes(stack.id));
//   }, [tech_stacks]);

//   // 본인 카드인 경우 캐시 무효화를 위해 버전 쿼리스트링을 붙인 프로필 이미지 URL 생성
//   const versionedProfileImage = useMemo(() => {
//     const base = stripQuery(secureImageUrl(profile_image_url));
//     return isMyCard ? `${base}?v=${imageVersion}` : base;
//   }, [profile_image_url, imageVersion, isMyCard]);
  
//   // 본인 카드인 경우 캐시 무효화를 위해 버전 쿼리스트링을 붙인 배경 이미지 URL 생성
//   const versionedBackgroundImage = useMemo(() => {
//     const base = stripQuery(secureImageUrl(background_image_url));
//     return isMyCard ? `${base}?v=${imageVersion}` : base;
//   }, [background_image_url, imageVersion, isMyCard]);

//   return (
//     <>
//       <CardUIServer
//         nickname={nickname}
//         job_title={job_title}
//         experience={experience}
//         description={description}
//         background_image_url={versionedBackgroundImage}
//         profile_image_url={versionedProfileImage}
//         blog={blog}
//         first_link_type={first_link_type}
//         first_link={first_link}
//         second_link_type={second_link_type}
//         second_link={second_link}
//         liked={liked}
//         handleToggleLike={handleToggleLike}

//         onOpenModal={() => setIsModalOpen(true)}
//         imageVersion={imageVersion}
//       />

//       <CardModalServer
//         isModalOpen={isModalOpen}
//         closeModal={() => setIsModalOpen(false)}
//         nickname={nickname}
//         job_title={job_title}
//         experience={experience}
//         description={description}
//         profile_image_url={versionedProfileImage}
//         background_image_url={versionedBackgroundImage}
//         blog={blog}
//         liked={liked}
//         answer1={answer1}
//         answer2={answer2}
//         answer3={answer3}
//         first_link_type={first_link_type}
//         first_link={first_link}
//         second_link_type={second_link_type}
//         second_link={second_link}
//         handleToggleLike={handleToggleLike}
//         selectedTechStacks={selectedTechStacks}
//         imageVersion={imageVersion}
//       />
//     </>
//   );
// };

// export default MemberCard;