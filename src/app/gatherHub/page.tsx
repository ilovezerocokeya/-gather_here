//Page

"use client";
import React, { useState, useMemo } from 'react';
import MemberCard from '@/components/GatherHub/MemberCard';
import JobDirectory from '@/components/GatherHub/JobDirectory';
import { useUser } from '@/provider/UserContextProvider';

const GatherHubPage: React.FC = () => {
  const { userData } = useUser(); // UserContext에서 유저 정보 가져오기
  const isHubRegistered = userData?.hubCard || false;

  // 좋아요 상태 관리
  const [likedMembers, setLikedMembers] = useState<{ [key: string]: boolean }>({});

  // 좋아요 상태를 변경하는 함수
  const toggleLike = (nickname: string) => {
    setLikedMembers((prevLikedMembers) => ({
      ...prevLikedMembers,
      [nickname]: !prevLikedMembers[nickname], // 해당 멤버의 좋아요 상태 변경
    }));
  };

  const allMembers = useMemo(() => [
    ...(isHubRegistered
      ? [{
          nickname: userData?.nickname || '',
          jobTitle: userData?.job_title || '',
          experience: userData?.experience || '',
          blog: userData?.blog || '',
          description: '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
          backgroundImageUrl: '',
          profileImageUrl: userData?.profile_image_url || '',
          answer1: userData?.answer1 || '기본 답변 1',
          answer2: userData?.answer2 || '기본 답변 2',
          answer3: userData?.answer3 || '기본 답변 3',
          notionLink: 'https://www.notion.so/',
          instagramLink: 'https://www.instagram.com/',
          liked: likedMembers[userData?.nickname || ''] || false, // 좋아요 상태 전달
          toggleLike: toggleLike, // 좋아요 상태 변경 함수 전달
        }]
      : []),
      {
        nickname: '전정현',
        jobTitle: 'Design',
        experience: '신입',
        description: '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        answer1: userData?.answer1 || '기본 답변 1',
        answer2: userData?.answer2 || '기본 답변 2',
        answer3: userData?.answer3 || '기본 답변 3',
        liked: likedMembers['전정현'] || false, 
        toggleLike: toggleLike
      },
      {
        nickname: '김성준',
        jobTitle: 'Frontend',
        experience: '1년차',
        description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        answer1: userData?.answer1 || '기본 답변 1',
        answer2: userData?.answer2 || '기본 답변 2',
        answer3: userData?.answer3 || '기본 답변 3',
        liked: likedMembers['김성준'] || false,
        toggleLike: toggleLike
      },
      {
        nickname: '김영범',
        jobTitle: 'Backend',
        experience: '1년차',
        description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        answer1: userData?.answer1 || '기본 답변 1',
        answer2: userData?.answer2 || '기본 답변 2',
        answer3: userData?.answer3 || '기본 답변 3',
        liked: likedMembers['김영범'] || false, 
        toggleLike: toggleLike
      },
      {
        nickname: '조은영',
        jobTitle: 'PM',
        experience: '1년차',
        description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        answer1: userData?.answer1 || '기본 답변 1',
        answer2: userData?.answer2 || '기본 답변 2',
        answer3: userData?.answer3 || '기본 답변 3',
        liked: likedMembers['조은영'] || false,
        toggleLike: toggleLike
      },
      {
        nickname: '이하름',
        jobTitle: 'IOS',
        experience: '1년차',
        description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        answer1: userData?.answer1 || '기본 답변 1',
        answer2: userData?.answer2 || '기본 답변 2',
        answer3: userData?.answer3 || '기본 답변 3',
        liked: likedMembers['이하름'] || false,
        toggleLike: toggleLike
      },
      {
        nickname: '이보아',
        jobTitle: 'Android',
        experience: '1년차',
        description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        answer1: userData?.answer1 || '기본 답변 1',
        answer2: userData?.answer2 || '기본 답변 2',
        answer3: userData?.answer3 || '기본 답변 3',
        liked: likedMembers['이보아'] || false, 
        toggleLike: toggleLike
      },
    ], [isHubRegistered, userData, likedMembers]);

  // 'filteredJob' 상태에 따라 'allMembers' 배열에서 필터링된 멤버 목록을 반환하는 함수
  const [filteredJob, setFilteredJob] = useState<string>('all');

  // 'filteredMembers'는 'filteredJob' 값에 따라 필터링된 멤버 목록을 반환
  const filteredMembers = useMemo(() => {
    return filteredJob === 'all'
      ? allMembers.filter((member) => member.nickname && member.jobTitle && member.profileImageUrl)
      : allMembers.filter(
          (member) => member.jobTitle.toLowerCase() === filteredJob && member.nickname && member.profileImageUrl
        );
  }, [filteredJob, allMembers]);

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-4 py-8">
        {/* 작은 화면에서는 JobDirectory가 위로 올라가도록 */}
        <div className="mb-6 lg:hidden">
          <JobDirectory setFilteredJob={setFilteredJob} className="w-full" />
        </div>
        
        {/* Member Cards */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {filteredMembers.map((member, index) => (
            <MemberCard 
              key={index} 
              {...member} 
            />
          ))}
        </div>

        {/* 큰 화면에서는 JobDirectory가 오른쪽에 위치 */}
        <div className="hidden lg:block lg:ml-10 lg:w-40">
          <JobDirectory setFilteredJob={setFilteredJob} />
        </div>
      </div>
    </div>
  );
};

export default GatherHubPage;
