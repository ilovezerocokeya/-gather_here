'use client';

import React, { useEffect } from 'react';
import { UserData } from '@/types/userData';
import { useToastStore } from "@/stores/useToastStore";
import { usePostLikeStore } from '@/stores/usePostLikeStore';

interface LikeButtonProps {
  postId: string;
  currentUser: UserData | null;
  category: string;
  onRemoveBookmark?: (postId: string) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, currentUser, category, onRemoveBookmark }) => {
  const { likePosts, fetchLikeStatus, toggleLike, hydrate } = usePostLikeStore(); 
  const liked = likePosts[postId] ?? false;
  const { showToast } = useToastStore();

  // 유저 정보가 변경되면 로컬 스토리지에서 좋아요 상태 복구
  useEffect(() => {
    if (currentUser) {
      hydrate(currentUser.user_id);
    }
  }, [currentUser, hydrate]);
  
  // 로컬에 좋아요 상태가 없을 때만 서버에서 좋아요 상태 조회
  useEffect(() => {
    if (currentUser && likePosts[postId] === undefined) {
      void fetchLikeStatus(currentUser.user_id, postId);
    }
  }, [currentUser, postId, likePosts, fetchLikeStatus]);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = async () => {
    if (!currentUser) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }

    try {
      const likedNow = await toggleLike(currentUser.user_id, postId, category);

      // 좋아요 취소 시 북마크 리스트에서 제거
      if (!likedNow && onRemoveBookmark) {
        onRemoveBookmark(postId);
      }

      // 성공 알림
      showToast(
        likedNow ? "게시글을 좋아요 했습니다!" : "게시글 좋아요를 취소했습니다.",
        "success"
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      showToast(errorMessage, "error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleLike()}
        className="flex items-center justify-end w-[30px]"
        aria-label={liked ? '좋아요 취소' : '좋아요'}
      >
        <svg width="20" height="20" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.2867 0H4.71526C2.04384 0 0 2.08 0 4.8V30.4C0 30.72 0 30.88 0.15812 31.2C0.629548 32 1.57241 32.16 2.35812 31.84L11.0005 26.72L19.6433 31.84C19.9581 32 20.1153 32 20.4291 32C21.372 32 22.0005 31.36 22.0005 30.4V4.8C22.0005 2.08 19.9581 0 17.2867 0Z"
            fill={liked ? '#C3E88D' : '#5E5E5E'}
          />
        </svg>
      </button>
    </>
  );
};

export default LikeButton;