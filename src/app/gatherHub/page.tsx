"use client";
import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import JobDirectory from '@/components/GatherHub/JobDirectory';
import { useUser } from '@/provider/UserContextProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

    // MemberCard를 lazy loading으로 불러오기
    const MemberCard = dynamic(() => import('@/components/GatherHub/MemberCard'), {
    loading: () => <div>Loading...</div>,
    ssr: false,
    });

    // userData의 타입 정의
    interface UserData {
    answer1?: string;
    answer2?: string;
    answer3?: string;
    description?: string;
    }

    // Member 타입 정의
    interface Member {
    nickname: string;
    jobTitle: string;
    experience: string;
    profileImageUrl: string;
    blog?: string;
    notionLink?: string;
    instagramLink?: string;
    backgroundImageUrl?: string;
    liked?: boolean;
    toggleLike?: (nickname: string) => void;
}
  
  // 사용자의 기본 답변 및 자기소개를 제공하는 함수
  const getDefaultUserData = (userData: Partial<UserData>) => ({
    answer1: userData?.answer1 || '기본 답변 1',
    answer2: userData?.answer2 || '기본 답변 2',
    answer3: userData?.answer3 || '기본 답변 3',
    description: userData?.description || '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
  });
  
  // 서버에서 멤버 프로필 카드를 가져오는 함수
  const fetchMembers = async () => {
    const response = await axios.get('http://localhost:3000/gatherHub');
    return response.data;
  };
  
  const GatherHubPage: React.FC = () => {
    const { userData } = useUser(); // UserContext에서 유저 정보 가져오기
    const isHubRegistered = userData?.hubCard || false; // 사용자 Hub 등록 여부 확인
  
    // 좋아요 상태 관리
    const [likedMembers, setLikedMembers] = useState<{ [key: string]: boolean }>({});
  
    // 좋아요 상태를 변경하는 함수
    const toggleLike = useCallback((nickname: string) => {
      setLikedMembers((prevLikedMembers) => ({
        ...prevLikedMembers,
        [nickname]: !prevLikedMembers[nickname], // 해당 멤버의 좋아요 상태 변경
      }));
    }, []);
  
    // useQuery로 서버에서 멤버 데이터를 가져옴
    const { data: membersData, isLoading, error } = useQuery<Member[], Error>({
      queryKey: ['gatherHub', userData?.nickname],
      queryFn: fetchMembers,
      refetchOnWindowFocus: true, // 사용자가 페이지로 돌아왔을 때 데이터 새로고침
    });

    // 기본 멤버 데이터 설정 (목 데이터)
  const defaultMembers = [
    {
      nickname: '전정현',
      jobTitle: 'Design',
      experience: '신입',
      backgroundImageUrl: '/logos/hi.png',
      profileImageUrl: '/path-to-profile-image',
      blog: 'https://github.com/gather-here',
      ...getDefaultUserData({}),
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
      liked: likedMembers['전정현'] || false,
      toggleLike: toggleLike,
    },
    {
      nickname: '김성준',
      jobTitle: 'Frontend',
      experience: '1년차',
      backgroundImageUrl: '/logos/hi.png',
      profileImageUrl: '/path-to-profile-image',
      blog: 'https://github.com/gather-here',
      ...getDefaultUserData({}),
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
      liked: likedMembers['김성준'] || false,
      toggleLike: toggleLike,
    },
    {
      nickname: '김영범',
      jobTitle: 'Backend',
      experience: '1년차',
      backgroundImageUrl: '/logos/hi.png',
      profileImageUrl: '/path-to-profile-image',
      blog: 'https://github.com/gather-here',
      ...getDefaultUserData({}),
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
      liked: likedMembers['김영범'] || false,
      toggleLike: toggleLike,
    },
    {
        nickname: '조은영',
        jobTitle: 'PM',
        experience: '1년차',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        ...getDefaultUserData({}),        
        liked: likedMembers['조은영'] || false,
        toggleLike: toggleLike
      },
      {
        nickname: '이하름',
        jobTitle: 'IOS',
        experience: '1년차',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        ...getDefaultUserData({}),        
        liked: likedMembers['이하름'] || false,
        toggleLike: toggleLike
      },
      {
        nickname: '이보아',
        jobTitle: 'Android',
        experience: '1년차',
        backgroundImageUrl: '/logos/hi.png',
        profileImageUrl: '/path-to-profile-image',
        blog:'https://github.com/gather-here',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        ...getDefaultUserData({}),        
        liked: likedMembers['이보아'] || false, 
        toggleLike: toggleLike
      },
  ];

  // 모든 멤버 데이터와 사용자의 데이터를 합쳐서 최적화된 목록을 생성
  const allMembers = useMemo(() => {
    const defaultUserData = getDefaultUserData(userData || {});

    // 서버에서 가져온 데이터를 우선 사용, 없으면 defaultMembers 사용
    const members = (Array.isArray(membersData)
    ? membersData.map((member: any) => ({
        ...member,
        liked: likedMembers[member.nickname] || false,
        toggleLike: toggleLike,
    }))
    : defaultMembers);

    // 사용자가 등록된 경우 사용자 프로필을 최상단에 추가
    if (isHubRegistered && userData) {
      members.unshift({ 
        nickname: userData.nickname || '',
        jobTitle: userData.job_title || '',
        experience: userData.experience || '',
        blog: userData.blog || '',
        ...defaultUserData,
        backgroundImageUrl: '',
        profileImageUrl: userData.profile_image_url || '',
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        liked: likedMembers[userData.nickname || ''] || false,
        toggleLike: toggleLike,
      });
    }
    return members;
  }, [isHubRegistered, userData, membersData, likedMembers, toggleLike]);

  // 직업 필터링 상태에 따른 멤버 목록 필터링
  const [filteredJob, setFilteredJob] = useState<string>('all');
  const filteredMembers = filteredJob === 'all'
    ? allMembers.filter((member) => member.nickname && member.jobTitle && member.profileImageUrl)
    : allMembers.filter((member) => member.jobTitle.toLowerCase() === filteredJob && member.nickname && member.profileImageUrl);

  // 로딩 중일 때 로딩 메시지 반환
  if (isLoading) {
    return <div>잠시만 기다려주세요. 멤버 데이터를 불러오는 중입니다...</div>;
  }

  // 에러 발생 시 에러 메시지 반환
  if (error) {
    return <div>멤버 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</div>;
  }


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