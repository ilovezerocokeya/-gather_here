import { create } from 'zustand';
import { supabase } from '@/utils/supabase/client';

interface PostLikeStoreState {
  likePosts: Record<string, boolean>;
  fetchLikeStatus: (userId: string, postId: string) => Promise<void>;
  toggleLike: (userId: string, postId: string, category: string, onSuccess?: (liked: boolean) => void, onError?: (message: string) => void) => Promise<void>;
}

export const usePostLikeStore = create<PostLikeStoreState>((set, get) => ({
  likePosts: {},

  fetchLikeStatus: async (userId, postId) => {
    const { data, error } = await supabase.from('Interests')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (!error && data) {
      set((state) => ({
        likePosts: {
          ...state.likePosts,
          [postId]: data.length > 0,
        },
      }));
    }
  },

  toggleLike: async (userId, postId, category, onSuccess, onError) => {
    const liked = get().likePosts[postId];

    if (!liked) {
      const { error } = await supabase.from('Interests').insert({
        user_id: userId,
        post_id: postId,
        category,
      });

      if (error) {
        onError?.('좋아요 등록 중 오류가 발생했습니다.');
      } else {
        set((state) => ({
          likePosts: { ...state.likePosts, [postId]: true },
        }));
        onSuccess?.(true);
      }
    } else {
      const { error } = await supabase.from('Interests')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      if (error) {
        onError?.('좋아요 취소 중 오류가 발생했습니다.');
      } else {
        set((state) => ({
          likePosts: { ...state.likePosts, [postId]: false },
        }));
        onSuccess?.(false);
      }
    }
  },
}));