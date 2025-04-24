'use client';

import PostFormWrapper from '@/components/PostForm/PostFormWrapper';
import { PostFormState } from '@/components/PostForm/postFormTypes';

interface Props {
  defaultValues: Partial<PostFormState>;
  postId: string;
}

const PostEditClient = ({ defaultValues, postId }: Props) => {
  return <PostFormWrapper mode="edit" defaultValues={defaultValues} postId={postId} />;
};

export default PostEditClient;