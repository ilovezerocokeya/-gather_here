"use client";
import React, { useState } from 'react';
import MemberCard from '@/components/GatherHub/MemberCard';
import JobDirectory from '@/components/GatherHub/JobDirectory';
import { useUser } from '@/provider/UserContextProvider';

const GatherHubPage: React.FC = () => {
  const { userData } = useUser(); // UserContext에서 유저 정보 가져오기
  const [isHubRegistered, setIsHubRegistered] = useState(false); // Hub 등록 상태 관리
  const allMembers = [
    // 유저가 Hub에 등록되었을 때만 자신의 정보를 보여줌
    ...(isHubRegistered
      ? [{
          nickname: userData?.nickname || '',
          jobTitle: userData?.job_title || '',
          experience: userData?.experience || '',
          blog: userData?.blog || '',
          description: '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
          backgroundImageUrl: '/path-to-portfolio-image',
          profileImageUrl: userData?.profile_image_url || '',
          notionLink: 'https://www.notion.so/',
          instagramLink: 'https://www.instagram.com/',
        }]
      : []),
    {
      nickname: '전정현',
      jobTitle: 'Design',
      experience: '신입',
      description: '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
      backgroundImageUrl: '/path-to-portfolio-image-1',
      profileImageUrl: '/path-to-profile-image',
      blog:'',
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
    },
    {
      nickname: '김성준',
      jobTitle: 'Frontend',
      experience: '1년차',
      description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
      backgroundImageUrl: '/path-to-portfolio-image-1',
      profileImageUrl: '/path-to-profile-image',
      blog:'',
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
    },
    {
      nickname: '김영범',
      jobTitle: 'Backend',
      experience: '1년차',
      description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
      backgroundImageUrl: '/path-to-portfolio-image-1',
      profileImageUrl: '/path-to-profile-image',
      blog:'',
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
    },
    {
      nickname: '조은영',
      jobTitle: 'PM',
      experience: '1년차',
      description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
      backgroundImageUrl: '/path-to-portfolio-image-1',
      profileImageUrl: '/path-to-profile-image',
      blog:'',
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
    },
    {
      nickname: '이하름',
      jobTitle: 'IOS',
      experience: '1년차',
      description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
      backgroundImageUrl: '/path-to-portfolio-image-1',
      profileImageUrl: '/path-to-profile-image',
      blog:'',
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
    },
    {
      nickname: '이보아',
      jobTitle: 'Android',
      experience: '1년차',
      description: '최신 웹 기술을 사용하여 효율적인 코드를 작성합니다.',
      backgroundImageUrl: '/path-to-portfolio-image-1',
      profileImageUrl: '/path-to-profile-image',
      blog:'',
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
    },
  ];

  const [filteredJob, setFilteredJob] = useState<string>('all');

  // 직업군에 따라 필터링된 멤버 목록
  const filteredMembers = filteredJob === 'all'
    ? allMembers.filter((member) => member.nickname && member.jobTitle && member.profileImageUrl)
    : allMembers.filter(
        (member) => member.jobTitle.toLowerCase() === filteredJob && member.nickname && member.profileImageUrl
      );

  // Hub 등록 처리 함수
  const handleHubRegister = () => {
    setIsHubRegistered(true); // Hub 등록 상태를 true로 변경
  };

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
            <MemberCard key={index} {...member} />
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