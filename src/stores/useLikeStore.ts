import { create } from "zustand";

// 좋아요 상태 인터페이스
interface LikeStore {
  likedMembers: { [key: string]: boolean }; // 좋아요 상태를 저장하는 객체
  toggleLike: (nickname: string) => void; // 특정 닉네임의 좋아요 상태를 반전하는 함수
  syncLikesWithServer: () => Promise<void>; // 서버와 좋아요 상태 동기화
}

// Zustand Store 생성
export const useLikeStore = create<LikeStore>((set, get) => ({
  likedMembers: {},

  // 좋아요 상태를 토글하는 함수
  toggleLike: (nickname: string) => {
    const currentLikedMembers = get().likedMembers;
    const updatedLikedMembers = {
      ...currentLikedMembers,
      [nickname]: !currentLikedMembers[nickname],
    };

    // 로컬 스토리지 저장
    localStorage.setItem("likedMembers", JSON.stringify(updatedLikedMembers));

    set({ likedMembers: updatedLikedMembers });
  },

  // 서버와 좋아요 상태 동기화
  syncLikesWithServer: async () => {
    const likedMembers = get().likedMembers;

    try {
      const response = await fetch("/api/sync-likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(likedMembers),
      });

      if (!response.ok) {
        throw new Error("Failed to sync likes with server");
      }

      console.log("Likes synced with server successfully!");
    } catch (error) {
      console.error("Error syncing likes with server:", error);
    }
  },
}));