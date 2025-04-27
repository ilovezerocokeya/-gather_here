import { PostWithUser } from "@/types/posts/Post.type";
import BaseClientContent from "../BaseClientConent";

interface StudiesClientContentProps {
  initialPosts: PostWithUser[];
  initialCarouselPosts: PostWithUser[];
}

const StudiesClientContent: React.FC<StudiesClientContentProps> = ({ initialPosts, initialCarouselPosts }) => {
  return (
    <BaseClientContent
      category="스터디"
      scrollKey="studies-scroll"
      initialPosts={initialPosts} 
      initialCarouselPosts={initialCarouselPosts}
    />
  );
};

export default StudiesClientContent;