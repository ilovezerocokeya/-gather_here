import { create } from "zustand";
import { supabase } from "@/utils/supabase/client";

// 좋아요 상태 인터페이스
interface LikeStore {
  likedMembers: { [key: string]: boolean }; // 좋아요한 유저 목록
  toggleLike: (likedUserId: string, userId: string) => Promise<void>; // 좋아요 토글
  syncLikesWithServer: (userId: string) => Promise<void>; // 서버에서 동기화
  hydrate: (userId: string) => void; // 앱 실행 시 로컬 스토리지에서 불러오기
  reset: (userId: string) => void; // 로그아웃 시 초기화
}

// 유저별 로컬 스토리지 키 생성
const getLocalStorageKey = (userId: string) => `likedMembers_${userId}`;

export const useLikeStore = create<LikeStore>((set, get) => ({
  likedMembers: {},

  // 앱 실행 시 로컬 데이터 불러오기
  hydrate: (userId) => {
    if (!userId) 
      return;

    const storedLikes = JSON.parse(localStorage.getItem(getLocalStorageKey(userId)) || "{}");
    set({ likedMembers: storedLikes });
  },

  // 좋아요 상태 토글
  toggleLike: async (likedUserId, userId) => {
    if (!userId || !likedUserId) return;

    const currentLikedMembers = get().likedMembers;
    const isLiked = !!currentLikedMembers[likedUserId];

    // Optimistic UI 적용: 상태를 먼저 변경
    const updatedLikedMembers = { ...currentLikedMembers, [likedUserId]: !isLiked };
    set({ likedMembers: updatedLikedMembers });
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(updatedLikedMembers));

    try {
      if (!isLiked) {
        await supabase.from("User_Interests").insert([
          { user_id: userId, liked_user_id: likedUserId, created_at: new Date().toISOString() }
        ]);
      } else {
        await supabase.from("User_Interests").delete()
          .eq("user_id", userId)
          .eq("liked_user_id", likedUserId);
      }
    } catch (error) {
      console.error("좋아요 동기화 오류:", error);

      // 2️⃣ 실패 시 상태 롤백
      set({ likedMembers: currentLikedMembers });
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(currentLikedMembers));
    }
  },

  // 서버와 좋아요 상태 동기화
  syncLikesWithServer: async (userId) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase.from("User_Interests").select("liked_user_id").eq("user_id", userId);
      if (error) throw error;

      const likedMembersMap = data.reduce((acc, item) => {
        acc[item.liked_user_id] = true;
        return acc;
      }, {} as { [key: string]: boolean });

      set({ likedMembers: likedMembersMap });
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(likedMembersMap));

    } catch (error) {
      console.error("서버와 좋아요 동기화 오류:", error);
    }
  },

  // 로그아웃 시 초기화
  reset: (userId) => {
    set({ likedMembers: {} });
    localStorage.removeItem(getLocalStorageKey(userId));
  },
}));