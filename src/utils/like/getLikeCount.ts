import { supabase } from "@/utils/supabase/client";


// 프로필 좋아요 수 가져오기
export const getLikeCount = async (likedUserId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("User_Interests")
    .select("*", { count: "exact", head: true })
    .eq("liked_user_id", likedUserId);

  if (error) {
    console.error("좋아요 수 조회 실패:", error);
    return 0;
  }

  return count ?? 0;
};

 // 게시물 좋아요 수 가져오기
 export const getPostLikeCount = async (postId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('Interests')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      console.error('좋아요 수 가져오기 실패:', error);
      return 0;
    }

    return count ?? 0;
  };