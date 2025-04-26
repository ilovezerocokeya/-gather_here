import { createServerSupabaseClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import PostEditClient from './PostEditClient';
import { convertPostToFormState } from '@/utils/postUtils/postFormUtils';


const PostEditServer = async ({ postId }: { postId: string }) => {
  const supabase = createServerSupabaseClient();
  
  const { data: post, error } = await supabase
  .from('Posts')
  .select('*')
  .eq('post_id', postId)
  .single();
  
  if (error || !post) return notFound();
  const defaultValues = convertPostToFormState(post);

  return <PostEditClient defaultValues={defaultValues} postId={postId} />;
};

export default PostEditServer;