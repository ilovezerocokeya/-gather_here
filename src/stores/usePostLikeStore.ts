import { create } from 'zustand';
import { supabase } from '@/utils/supabase/client';

// Zustand 스토어 타입 정의
interface PostLikeStoreState {
  likePosts: Record<string, boolean>; // key: postId, value: liked 여부
  fetchLikeStatus: (userId: string, postId: string) => Promise<void>;
  toggleLike: (userId: string, postId: string, category: string) => Promise<boolean>;
  hydrate: (userId: string) => void;
  reset: () => void;
}

// 유저별 로컬스토리지 키 생성 함수
const getLocalStorageKey = (userId: string) => `likePosts_${userId}`;

// 게시글 좋아요 관련 전역 상태 관리 스토어 정의
export const usePostLikeStore = create<PostLikeStoreState>((set, get) => ({
  likePosts: {},

  // 로그인 시 로컬 스토리지로부터 좋아요 상태 복원
  hydrate: (userId) => {
    if (!userId) return;
    const stored = localStorage.getItem(getLocalStorageKey(userId));
    const parsed = stored ? JSON.parse(stored) as Record<string, boolean> : {};
    set({ likePosts: parsed });
  },

  // 특정 게시글에 대한 좋아요 상태를 Supabase에서 조회 → 상태 저장
  fetchLikeStatus: async (userId, postId) => {
    const { data, error } = await supabase
      .from('Interests')
      .select('user_id') // 최소 필드만 선택
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (!error && data) {
      const isLiked = data.length > 0;
      set((state) => {
        const updated = { ...state.likePosts, [postId]: isLiked };
        localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(updated));
        return { likePosts: updated };
      });
    }
  },

  // 좋아요 토글 핸들러 (Optimistic UI 적용)
  toggleLike: async (userId, postId, category) => {
    const liked = get().likePosts[postId];
    const previousLikePosts = { ...get().likePosts };

    // Optimistic UI: 먼저 반영
    const nextState = { ...previousLikePosts, [postId]: !liked };
    set({ likePosts: nextState });
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(nextState));

    try {
      if (!liked) {
        // Conflict 방지: insert 전에 존재 여부 확인
        const { data: existing, error: checkError } = await supabase
          .from('Interests')
          .select('user_id')
          .eq('user_id', userId)
          .eq('post_id', postId)
          .maybeSingle();

        if (checkError) throw new Error('좋아요 상태 확인 중 오류 발생');

        if (!existing) {
          const { error: insertError } = await supabase.from('Interests').insert({
            user_id: userId,
            post_id: postId,
            category,
          });
          if (insertError) throw new Error('좋아요 등록 중 오류가 발생했습니다.');
        }
      } else {
        const { error: deleteError } = await supabase.from('Interests')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);
        if (deleteError) throw new Error('좋아요 취소 중 오류가 발생했습니다.');
      }

      return !liked;
    } catch (err) {
      // 실패 시 롤백
      set({ likePosts: previousLikePosts });
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(previousLikePosts));
      throw err;
    }
  },

  // 로그아웃 시 상태 초기화
  reset: () => {
    set({ likePosts: {} });
    // 로컬 스토리지는 유저 로그아웃 후 따로 제거할 수 있도록 UI에서 직접 처리해도 무방
  },
}));