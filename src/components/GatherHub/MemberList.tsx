"use client";
import React from "react";
import MemberCard from "@/components/GatherHub/MemberCard";
import { MemberListProps } from "@/lib/gatherHub";
import { useLikeStore } from "@/stores/useLikeStore";
import { useUserData } from "@/provider/user/UserDataProvider";

const MemberList: React.FC<MemberListProps> = ({ filteredMembers }) => {
  const { likedMembers, toggleLike } = useLikeStore(); // zustand에서 좋아요 상태 가져오기
  const { userData } = useUserData(); // 로그인된 사용자 정보 가져오기

  return (
    <div className="flex-grow grid grid-cols-1 z-10 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center mx-auto">
      {filteredMembers.map((member) => {
        const isLiked = likedMembers[member.user_id] || false; // 좋아요 상태 확인

        return (
          <div key={member.user_id}>
            <MemberCard
              {...member}
              description={member.description || "소개 정보 없음"}
              first_link_type={member.first_link_type || ""}
              first_link={member.first_link || ""}
              second_link_type={member.second_link_type || ""}
              second_link={member.second_link || ""}
              tech_stacks={member.tech_stacks || []} 
              liked={isLiked}
              toggleLike={() => {
                if (!userData?.user_id) {
                  console.warn("좋아요 실패: 로그인된 사용자가 없습니다.");
                  return;
                }
                toggleLike(member.user_id, userData.user_id);
              }} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default MemberList;