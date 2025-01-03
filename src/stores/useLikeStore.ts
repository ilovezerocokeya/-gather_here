"use client";

import { create } from "zustand";

interface LikeStore {
  likedMembers: { [key: string]: boolean }; // 좋아요 상태
  toggleLike: (userId: string) => void; // 좋아요 상태를 토글하는 함수
}

export const useLikeStore = create<LikeStore>((set) => ({
  likedMembers: {},

  toggleLike: (userId: string) => {
    set((state) => ({
      likedMembers: {
        ...state.likedMembers,
        [userId]: !state.likedMembers[userId], // 좋아요 상태 반전
      },
    }));
  },
}));
