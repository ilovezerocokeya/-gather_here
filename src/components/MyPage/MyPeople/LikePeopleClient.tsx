"use client";

import CardUIClient from "@/components/GatherHub/CardUIClient";
import { useLikeStore } from "@/stores/useLikeStore";
import { useState, useEffect, useMemo } from "react";
import type { UserData } from "@/types/userData";
import Pagination from "@/components/MyPage/Common/Pagination";
import { safeSyncLikesWithServer } from "@/utils/sync/safeSyncLikesWithServer";


type LikedMember = Omit<UserData, "hubCard">;

interface Props {
  userId: string;
  likedMembers: LikedMember[];
}

const LikePeopleClient = ({ userId, likedMembers }: Props) => {
  const { likedMembers: likedMap } = useLikeStore();

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 6;

  // 서버로부터 받은 likedMembers에 없는 liked user도 추가로 처리
  const enrichedLikedMembers = useMemo(() => {
    const likedIds = Object.keys(likedMap).filter((id) => likedMap[id]);
    const knownIds = new Set(likedMembers.map((m) => m.user_id));

    const newMembers = likedIds
      .filter((id) => !knownIds.has(id))
      .map((id) => ({
        user_id: id,
        nickname: "알 수 없음",
        job_title: "",
        experience: "",
        description: "",
        background_image_url: "",
        profile_image_url: "",
        blog: "",
        first_link: undefined,
        first_link_type: undefined,
        second_link: undefined,
        second_link_type: undefined,
      }));

    return [...likedMembers, ...newMembers];
  }, [likedMembers, likedMap]);

  // zustand 기반 좋아요 상태로 필터링된 멤버만 렌더링
  const visibleMembers = useMemo(() => {
    return enrichedLikedMembers.filter((member) => likedMap[member.user_id]);
  }, [enrichedLikedMembers, likedMap]);

  const totalPages = useMemo(
    () => Math.ceil(visibleMembers.length / membersPerPage),
    [visibleMembers]
  );

  const currentMembers = useMemo(() => {
    const start = (currentPage - 1) * membersPerPage;
    return visibleMembers.slice(start, start + membersPerPage);
  }, [visibleMembers, currentPage]);

  useEffect(() => {
    void safeSyncLikesWithServer(userId);
  }, [userId]);;

  return (
    <div className="my-people-page">
      <h1 className="text-xl font-bold mb-6">내 관심 멤버</h1>

      {currentMembers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-28">
            {currentMembers.map((member) => (
              <CardUIClient
                key={member.user_id}
                user_id={member.user_id}
                nickname={member.nickname ?? ""}
                job_title={member.job_title ?? ""}
                experience={member.experience ?? ""}
                description={member.description ?? ""}
                background_image_url={member.background_image_url ?? ""}
                profile_image_url={member.profile_image_url ?? ""}
                blog={member.blog ?? ""}
                first_link_type={member.first_link_type}
                first_link={member.first_link}
                second_link_type={member.second_link_type}
                second_link={member.second_link}
                imageVersion={0}
                priority={false}
                liked={!!likedMap[member.user_id]}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <p className="mt-8 text-center text-labelNeutral col-span-full">
          관심 멤버가 없습니다🧐
        </p>
      )}
    </div>
  );
};

export default LikePeopleClient;