import { create } from "zustand";
import { supabase } from "@/utils/supabase/client";

// 좋아요 상태 인터페이스
interface LikeStore {
  likedMembers: { [key: string]: boolean }; // 좋아요 상태를 저장하는 객체
  toggleLike: (nickname: string, userId: string) => Promise<void>; // 특정 닉네임의 좋아요 상태를 반전하는 함수
  syncLikesWithServer: (userId: string) => Promise<void>; // 서버와 좋아요 상태 동기화
}

// Zustand Store 생성
export const useLikeStore = create<LikeStore>((set, get) => ({
  likedMembers: JSON.parse(localStorage.getItem("likedMembers") || "{}"),

  // 좋아요 상태를 토글하는 함수 (localStorage + Supabase)
  toggleLike: async (nickname, userId) => {
    const currentLikedMembers = get().likedMembers;
    const isLiked = currentLikedMembers[nickname] || false;

    // UI 즉시 반영 (낙관적 업데이트)
    const updatedLikedMembers = { ...currentLikedMembers, [nickname]: !isLiked };
    set({ likedMembers: updatedLikedMembers });

    // 로컬 스토리지 저장
    localStorage.setItem("likedMembers", JSON.stringify(updatedLikedMembers));

    // 닉네임을 이용해 해당 유저의 user_id 찾기
    const { data: user, error: userError } = await supabase
      .from("Users")
      .select("user_id")
      .eq("nickname", nickname)
      .single();

    if (userError || !user?.user_id) {
      console.error("유저 찾기 오류:", userError);
      return;
    }

    const likedUserId = user.user_id;

    if (!userId) {
      console.error("로그인한 사용자 ID 없음");
      return;
    }

    try {
      if (!isLiked) {
        // Supabase에 좋아요 추가
        await supabase
          .from("User_Interests")
          .insert([{ user_id: userId, liked_user_id: likedUserId, created_at: new Date().toISOString() }]);
      } else {
        // Supabase에서 좋아요 삭제
        await supabase
          .from("User_Interests")
          .delete()
          .eq("user_id", userId)
          .eq("liked_user_id", likedUserId);
      }
    } catch (error) {
      console.error("좋아요 동기화 오류:", error);
      // 서버 동기화 실패 시 로컬 상태 롤백
      set({ likedMembers: currentLikedMembers });
      localStorage.setItem("likedMembers", JSON.stringify(currentLikedMembers));
    }
  },

  // 서버와 좋아요 상태 동기화
  syncLikesWithServer: async (userId) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("User_Interests")
        .select("liked_user_id")
        .eq("user_id", userId);

      if (error) {
        console.error("좋아요 데이터 가져오기 오류:", error);
        return;
      }

      const likedMembersMap = data.reduce((acc, item) => {
        acc[item.liked_user_id] = true;
        return acc;
      }, {} as { [key: string]: boolean });

      set({ likedMembers: likedMembersMap });

      // 로컬 스토리지에도 저장 (초기 동기화)
      localStorage.setItem("likedMembers", JSON.stringify(likedMembersMap));
    } catch (error) {
      console.error("서버와 좋아요 동기화 오류:", error);
    }
  },
}));