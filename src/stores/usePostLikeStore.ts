import { create } from 'zustand';
import { supabase } from '@/utils/supabase/client';

// 타입 정의
interface PostLikeStoreState {
  likePosts: Record<string, boolean>;
  fetchLikeStatus: (userId: string, postId: string) => Promise<void>;
  toggleLike: (userId: string, postId: string, category: string) => Promise<boolean>;
  hydrate: (userId: string) => void;
  reset: (userId: string) => void;
}

// 로컬 스토리지 키 생성 함수
const getLocalStorageKey = (userId: string) => `likePosts_${userId}`;

export const usePostLikeStore = create<PostLikeStoreState>((set, get) => ({
  likePosts: {},

  // 로컬 스토리지로부터 좋아요 상태 복구
  hydrate: (userId) => {
    if (!userId) return;
    const stored = localStorage.getItem(getLocalStorageKey(userId));
    const parsed = stored ? JSON.parse(stored) as Record<string, boolean> : {};
    set({ likePosts: parsed });
  },

  // 서버에서 좋아요 상태 조회 후 로컬에도 저장
  fetchLikeStatus: async (userId, postId) => {
    const { data, error } = await supabase.from('Interests')
      .select('*')
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

  // 좋아요 토글 
  toggleLike: async (userId, postId, category) => {
    const liked = get().likePosts[postId];
    const previousLikePosts = { ...get().likePosts };

    // Optimistic UI: 상태 먼저 바꿈
    set((state) => {
      const updated = { ...state.likePosts, [postId]: !liked };
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(updated));
      return { likePosts: updated };
    });

    try {
      if (!liked) {
        const { error } = await supabase.from('Interests').insert({
          user_id: userId,
          post_id: postId,
          category,
        });

        if (error) throw new Error('좋아요 등록 중 오류가 발생했습니다.');
      } else {
        const { error } = await supabase.from('Interests')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        if (error) throw new Error('좋아요 취소 중 오류가 발생했습니다.');
      }

      // 성공했으면 반전된 liked 반환
      return !liked;
    } catch (error) {
      // 실패 시 롤백
      set({ likePosts: previousLikePosts });
      localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(previousLikePosts));
      throw error; // 에러는 그대로 던져서 버튼 쪽에서 catch
    }
  },


  // 로그아웃 시 상태 초기화
  reset: (userId) => {
    set({ likePosts: {} });
    localStorage.removeItem(getLocalStorageKey(userId));
  },
}));