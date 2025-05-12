import { createServerSupabaseClient } from '@/utils/supabase/server';
import MainDetailClient from './MainDetailClient';
import { notFound } from 'next/navigation';

interface MainDetailProps {
    postId: string; // 상세 페이지의 게시글 ID
}

const MainDetailServer = async ({ postId }: MainDetailProps) => {
    const supabase = createServerSupabaseClient();

    // 게시글 정보 조회
    const { data: post, error: postError } = await supabase
        .from('Posts')
        .select('*')
        .eq('post_id', postId)
        .single();

    if (postError || !post) return notFound(); // 게시글이 없거나 조회 실패 시 404 페이지로 이동

    // 게시글 작성자 정보 조회
    const { data: user } = await supabase
        .from('Users')
        .select('profile_image_url, nickname')
        .eq('user_id', post.user_id)
        .single();
        
    if (!user) return notFound();  // 유저 정보가 없을 경우도 404 처리

    // 클라이언트 컴포넌트에 게시글과 유저 정보 전달
    return <MainDetailClient post={post} user={user} />;
};

export default MainDetailServer;