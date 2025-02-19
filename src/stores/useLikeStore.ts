import { create } from "zustand";
import { supabase } from "@/utils/supabase/client";

// 좋아요 상태 인터페이스
interface LikeStore {
  likedMembers: { [key: string]: boolean }; // 현재 좋아요한 유저 목록을 저장
  toggleLike: (likedUserId: string, userId: string) => Promise<void>; // 특정 유저에 대한 좋아요 상태를 토글하는 함수
  syncLikesWithServer: (userId: string) => Promise<void>; // 서버에서 최신 좋아요 상태를 가져와 동기화하는 함수
  reset: (userId: string) => void; // 로그아웃 시 좋아요 상태를 초기화하는 함수
}

// 유저별 로컬 스토리지 키를 생성하는 함수
const getLocalStorageKey = (userId: string) => `likedMembers_${userId}`;

// Zustand Store 생성
export const useLikeStore = create<LikeStore>((set, get) => ({
  likedMembers: {}, // 초기 상태는 빈 객체 (로그인 시 서버에서 동기화)

  // 좋아요 상태 토글 함수
  toggleLike: async (likedUserId, userId) => {
    if (!userId || !likedUserId) return; // 유저 ID가 없으면 실행하지 않음

    const currentLikedMembers = get().likedMembers; // 현재 좋아요 상태 가져오기
    const isLiked = !!currentLikedMembers[likedUserId]; // 해당 유저가 좋아요 되어있는지 확인

    // UI 즉시 반영 (낙관적 업데이트)
    const updatedLikedMembers = { ...currentLikedMembers, [likedUserId]: !isLiked };
    set({ likedMembers: updatedLikedMembers });

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

      // 서버 요청 성공 시 로컬 스토리지 업데이트
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(updatedLikedMembers));
    } catch (error) {
      console.error("좋아요 동기화 오류:", error);
      
      // 서버 요청 실패 시 로컬 상태 롤백
      set({ likedMembers: currentLikedMembers });
    }
  },

  // 서버와 좋아요 상태 동기화 (로그인 시 호출)
  syncLikesWithServer: async (userId) => {
    if (!userId) return; // 유저 ID가 없으면 실행하지 않음

    try {
      // 서버에서 유저의 좋아요 목록 가져오기
      const { data, error } = await supabase
        .from("User_Interests")
        .select("liked_user_id")
        .eq("user_id", userId);

      if (error) {
        console.error("좋아요 데이터 가져오기 오류:", error);
        return;
      }

      // 서버에서 가져온 데이터를 Zustand 상태로 변환
      const likedMembersMap = data.reduce((acc, item) => {
        acc[item.liked_user_id] = true;
        return acc;
      }, {} as { [key: string]: boolean });

      // Zustand 상태 업데이트
      set({ likedMembers: likedMembersMap });

      // 로컬 스토리지 업데이트
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(likedMembersMap));
    } catch (error) {
      console.error("서버와 좋아요 동기화 오류:", error);
    }
  },

  // 좋아요 상태 초기화 (로그아웃 시 호출)
  reset: (userId) => {
    set({ likedMembers: {} }); // Zustand 상태 초기화

    // 로컬 스토리지 초기화
    localStorage.removeItem(getLocalStorageKey(userId));

    console.log("좋아요 상태 초기화됨.");
  },
}));