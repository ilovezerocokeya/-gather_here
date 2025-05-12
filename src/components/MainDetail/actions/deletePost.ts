'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

// 게시글 삭제 처리
export async function deletePost(postId: string, currentUserId: string) {
  const supabase = createServerSupabaseClient();

  // 게시글 작성자 확인
  const { data: post } = await supabase
    .from('Posts')
    .select('user_id')
    .eq('post_id', postId)
    .single();

  // 게시글이 없거나, 작성자가 본인이 아닌 경우 삭제 불가
  if (!post || post.user_id !== currentUserId) {
    return { success: false, error: '권한이 없습니다.' };
  }

  // 게시글 삭제 요청
  const { error } = await supabase
    .from('Posts')
    .delete()
    .eq('post_id', postId);

  if (error) return { success: false, error: error.message };

  return { success: true };
}