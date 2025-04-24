import PostEditServer from "@/components/PostEdit/PostEditServer";


interface PageProps {
  params: { id: string };
}

const PostEditPage = ({ params }: PageProps) => {
  return <PostEditServer postId={params.id} />;
};

export default PostEditPage;