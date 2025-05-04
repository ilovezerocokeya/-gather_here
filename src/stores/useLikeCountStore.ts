import { create } from "zustand";

interface LikeCountStore {
  likeCount: number;
  setLikeCount: (count: number) => void;
  increment: () => void;
  reset: () => void;
}

export const useLikeCountStore = create<LikeCountStore>((set) => ({
  likeCount: 0,
  setLikeCount: (count) => set({ likeCount: count }),
  increment: () => set((state) => ({ likeCount: state.likeCount + 1 })),
  reset: () => set({ likeCount: 0 }),
}));