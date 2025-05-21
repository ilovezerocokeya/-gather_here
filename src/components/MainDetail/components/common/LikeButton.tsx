'use client';

import React, { useEffect } from 'react';
import { useToastStore } from "@/stores/useToastStore";
import { usePostLikeStore } from '@/stores/usePostLikeStore';
import { supabase } from "@/utils/supabase/client";

interface LikeButtonProps {
  postId: string; // 게시글 ID
  category: string; // 게시글 카테고리
  onRemoveBookmark?: (postId: string) => void; // 좋아요 취소 시 외부에서 처리할 콜백
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, category, onRemoveBookmark }) => {
  const { likePosts, fetchLikeStatus, toggleLike, hydrate } = usePostLikeStore(); 
  const liked = likePosts[postId] ?? false; // 현재 게시글의 좋아요 여부
  const { showToast } = useToastStore(); // 알림 토스트 스토어

  // 마운트 시 Supabase 유저를 확인하여 좋아요 상태를 초기화
  useEffect(() => {
    const init = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.warn(`[LikeButton-${postId}] Supabase 유저 정보 조회 실패`, error.message);
        return;
      }

      if (user) {
        // 로컬 스토리지 기반 좋아요 상태 복원
        hydrate(user.id);

        // 해당 게시글의 좋아요 상태가 로컬에 없을 경우 서버에서 조회
        if (!(postId in likePosts)) {
          await fetchLikeStatus(user.id, postId);
        }
      }
    };

    void init();
  }, [postId]); // postId 변경 시만 실행되도록 최소한의 의존성 설정

  // 좋아요 버튼 클릭 시 실행되는 함수
  const handleLike = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.warn(`[LikeButton-${postId}] Supabase 유저 조회 실패`, error.message);
    }

    // 로그인 상태가 아니면 에러 토스트 표시
    if (!user) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }

    try {
      // 좋아요 상태 토글 
      const likedNow = await toggleLike(user.id, postId, category);

      // 좋아요 취소 시 외부 콜백이 있으면 실행
      if (!likedNow && onRemoveBookmark) {
        onRemoveBookmark(postId);
      }

      // 좋아요 등록일 경우에만 토스트 표시
      if (likedNow) {
        showToast("게시글을 좋아요 했습니다!", "success");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      showToast(errorMessage, "error");
    }
  };

  // 좋아요 버튼 렌더링
  return (
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
  );
};

export default LikeButton;