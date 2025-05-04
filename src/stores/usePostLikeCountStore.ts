import { create } from "zustand";

interface PostLikeCountStore {
  likeCounts: Record<string, number>;
  setLikeCount: (postId: string, count: number) => void;
  getLikeCount: (postId: string) => number;
  reset: () => void;
}

export const usePostLikeCountStore = create<PostLikeCountStore>((set, get) => ({
  likeCounts: {},

  // 개별 포스트의 좋아요 수 저장
  setLikeCount: (postId, count) =>
    set((state) => ({
      likeCounts: {
        ...state.likeCounts,
        [postId]: count,
      },
    })),

  // 좋아요 수 가져오기
  getLikeCount: (postId) => {
    return get().likeCounts[postId] ?? 0;
  },

  // 전체 리셋
  reset: () => set({ likeCounts: {} }),
}));