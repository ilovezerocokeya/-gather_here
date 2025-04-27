
import { PostWithUser } from "@/types/posts/Post.type";
import BaseClientContent from "../BaseClientConent";

interface ProjectClientContentProps {
  initialPosts: PostWithUser[];
  initialCarouselPosts: PostWithUser[];
}

const ProjectClientContent: React.FC<ProjectClientContentProps> = ({ initialPosts, initialCarouselPosts  }) => {
  return (
    <BaseClientContent
      category="프로젝트"
      scrollKey="projects-page-scroll"
      initialPosts={initialPosts} 
      initialCarouselPosts={initialCarouselPosts}
    />
  );
};

export default ProjectClientContent;