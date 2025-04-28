'use client';

import React, { useEffect, useState } from 'react';
import { UserData } from '@/types/userData';
import Toast from '@/components/Common/Toast/Toast';
import { createPortal } from 'react-dom';
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
  const [toast, setToast] = useState<{
    state: 'success' | 'error' | 'warn' | 'info' | 'custom';
    message: string;
  } | null>(null);

  // 1. currentUser 바뀔 때만 로컬 복구
  useEffect(() => {
    if (currentUser) {
      hydrate(currentUser.user_id);
    }
  }, [currentUser, hydrate]);
  
  // 2. postId에 대한 서버 fetch는 로컬에 없을 때만
  useEffect(() => {
    if (currentUser && likePosts[postId] === undefined) {
      void fetchLikeStatus(currentUser.user_id, postId);
    }
  }, [currentUser, postId, likePosts, fetchLikeStatus]);

  const handleLike = async () => {
    if (!currentUser) {
      setToast({ state: 'error', message: '로그인이 필요합니다!' });
      return;
    }

    try {
      const likedNow = await toggleLike(currentUser.user_id, postId, category);

      if (!likedNow && onRemoveBookmark) {
        onRemoveBookmark(postId);
      }

      setToast({
        state: 'success',
        message: likedNow ? '게시글을 좋아요 했습니다!' : '게시글 좋아요를 취소했습니다.',
      });
    } catch (error) {
      setToast({ state: 'error', message: (error as Error).message });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleLike()}
        className="flex items-center justify-end w-[30px]"
      >
        <svg width="20" height="20" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.2867 0H4.71526C2.04384 0 0 2.08 0 4.8V30.4C0 30.72 0 30.88 0.15812 31.2C0.629548 32 1.57241 32.16 2.35812 31.84L11.0005 26.72L19.6433 31.84C19.9581 32 20.1153 32 20.4291 32C21.372 32 22.0005 31.36 22.0005 30.4V4.8C22.0005 2.08 19.9581 0 17.2867 0Z"
            fill={liked ? '#C3E88D' : '#5E5E5E'}
          />
        </svg>
      </button>
      {toast &&
        createPortal(
          <Toast
            state={toast.state}
            message={toast.message}
            onClear={() => setToast(null)}
          />,
          document.body
        )}
    </>
  );
};

export default LikeButton;