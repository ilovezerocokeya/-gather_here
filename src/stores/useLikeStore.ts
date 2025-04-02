import { create } from "zustand";
import { supabase } from "@/utils/supabase/client";

// 좋아요 상태 인터페이스
interface LikeStore {
  likedMembers: Record <string, boolean> // 좋아요한 유저 목록
  toggleLike: (likedUserId: string, userId: string) => Promise<void>; // 좋아요 토글
  syncLikesWithServer: (userId: string) => Promise<void>; // 서버에서 동기화
  hydrate: (userId: string) => void; // 앱 실행 시 로컬 스토리지에서 불러오기
  reset: (userId: string) => void; // 로그아웃 시 초기화
}

// 유저별 로컬 스토리지 키 생성
const getLocalStorageKey = (userId: string) => `likedMembers_${userId}`;

export const useLikeStore = create<LikeStore>((set, get) => ({
  likedMembers: {}, // 좋아요 상태 초기화

  // 앱 실행 시 로컬 데이터 불러오기
  hydrate: (userId) => {
    if (!userId) return; // 유저 ID가 없으면 실행하지 않음

    // 로컬 스토리지에서 좋아요 상태를 가져오기
    const storedLikes = localStorage.getItem(getLocalStorageKey(userId));
    const parsedLikes = storedLikes ? JSON.parse(storedLikes) as Record<string, boolean> : {};

    // 상태 업데이트
    set({ likedMembers: parsedLikes });
  },

  // 좋아요 상태 토글
  toggleLike: async (likedUserId, userId) => {
    if (!userId || !likedUserId) return; // 유효한 userId와 likedUserId가 없으면 실행하지 않음

    const currentLikedMembers = get().likedMembers; // 현재 좋아요 상태 가져오기
    const isLiked = !!currentLikedMembers[likedUserId]; // 현재 유저가 좋아요를 눌렀는지 확인
    const updatedLikedMembers = { ...currentLikedMembers, [likedUserId]: !isLiked };
    set({ likedMembers: updatedLikedMembers }); // 상태 업데이트
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(updatedLikedMembers)); // 로컬 스토리지에 상태 저장

    try {
      // 좋아요가 없었으면 추가, 있으면 삭제
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

      // 실패 시 상태 롤백
      set({ likedMembers: currentLikedMembers });
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(currentLikedMembers)); // 상태 롤백 후 로컬 스토리지에 저장
    }
  },

  // 서버와 좋아요 상태 동기화
  syncLikesWithServer: async (userId) => {
    if (!userId) return; // 유저 ID가 없으면 실행하지 않음

    try {
      const { data, error } = await supabase.from("User_Interests").select("liked_user_id").eq("user_id", userId);
      
      if (error) {
        // 에러가 발생하면 Error 객체를 던짐
        if (error instanceof Error) {
          throw new Error(error.message || "서버와 좋아요 동기화 오류");
        }
        throw new Error("서버와 좋아요 동기화 오류");
      }
  
      // 서버에서 가져온 데이터를 기반으로 좋아요 상태 맵을 생성
      const likedMembersMap = data.reduce((acc, item) => {
        acc[item.liked_user_id] = true;
        return acc;
      }, {} as Record<string, boolean>);
  
      // 상태와 로컬 스토리지 업데이트
      set({ likedMembers: likedMembersMap });
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(likedMembersMap));
  
    } catch (error) {
      console.error("서버와 좋아요 동기화 오류:", error); // 동기화 중 에러 발생 시 처리
    }
  },

  // 로그아웃 시 초기화
  reset: (userId) => {
    set({ likedMembers: {} });  // 상태 초기화
    localStorage.removeItem(getLocalStorageKey(userId)); // 로컬 스토리지에서 데이터 삭제
  },
}));