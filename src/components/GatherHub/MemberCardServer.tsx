import CardModalShell from './CardModalShell';
import CardUIServer from './CardUIServer';
import { MemberType } from '@/lib/gatherHub';
import { stripQuery, secureImageUrl } from '@/utils/Image/imageUtils';

interface MemberCardServerProps extends MemberType {
  liked: boolean;
}

const MemberCardServer = ({
  user_id,
  nickname,
  job_title,
  experience,
  description,
  background_image_url,
  profile_image_url,
  blog,
  answer1,
  answer2,
  answer3,
  first_link_type,
  first_link,
  second_link_type,
  second_link,
  tech_stacks,
  liked,
}: MemberCardServerProps) => {
  const versionedProfileImage = stripQuery(secureImageUrl(profile_image_url));
  const versionedBackgroundImage = stripQuery(secureImageUrl(background_image_url));

  return (
    <CardModalShell
      user_id={user_id}
      nickname={nickname}
      job_title={job_title}
      experience={experience}
      description={description}
      background_image_url={versionedBackgroundImage}
      profile_image_url={versionedProfileImage}
      blog={blog}
      liked={liked}
      answer1={answer1}
      answer2={answer2}
      answer3={answer3}
      first_link_type={first_link_type}
      first_link={first_link}
      second_link_type={second_link_type}
      second_link={second_link}
      tech_stacks={tech_stacks}
      imageVersion={0}
      triggerNode={
        <CardUIServer
          user_id={user_id}
          nickname={nickname}
          job_title={job_title}
          experience={experience}
          description={description}
          background_image_url={versionedBackgroundImage}
          profile_image_url={versionedProfileImage}
          blog={blog}
          first_link_type={first_link_type}
          first_link={first_link}
          second_link_type={second_link_type}
          second_link={second_link}
          liked={liked}
          imageVersion={0}
        />
      }
    />
  );
};

export default MemberCardServer;