"use client";
import React, { useState, useMemo, useCallback } from 'react';
import MemberCard from '@/components/GatherHub/MemberCard';
import JobDirectory from '@/components/GatherHub/JobDirectory';
import { useUser } from '@/provider/UserContextProvider';
import { useQuery } from '@tanstack/react-query';

// 유저 데이터 인터페이스 정의
interface Member {
  nickname: string;
  job_title: string;
  experience: string;
  blog: string;
  description: string;
  background_image_url: string;
  profile_image_url: string;
  answer1: string;
  answer2: string;
  answer3: string;
  notionLink: string;
  instagramLink: string;
  liked: boolean;
  toggleLike: (nickname: string) => void;
}

// 유저 데이터를 가져오는 함수
const fetchMembers = async (): Promise<Member[]> => {
  const response = await fetch('/api/gatherHub');
  const Userdata = await response.json();
    return Userdata.members || []; 
};

const GatherHubPage: React.FC = () => {
  const { userData } = useUser(); 
  const isHubRegistered = userData?.hubCard || false; 

  // 좋아요 상태 관리
  const [likedMembers, setLikedMembers] = useState<{ [key: string]: boolean }>({});

  // 좋아요 상태를 변경하는 함수
  const toggleLike = useCallback((nickname: string) => {
    setLikedMembers((prevLikedMembers) => ({
      ...prevLikedMembers,
      [nickname]: !prevLikedMembers[nickname], 
    }));
  }, []);

  // 서버에서 멤버 데이터를 가져오는 useQuery 사용
  const { data: serverMembers = [], isLoading, isError, error } = useQuery({
    queryKey: ['members'], 
    queryFn: fetchMembers, 
  });

  // 사용자와 서버 멤버 데이터를 결합하여 allMembers 생성
  const allMembers = useMemo(() => {
    const userMember = isHubRegistered && userData ? [{
      nickname: userData.nickname || '',
      job_title: userData.job_title || '',
      experience: userData.experience || '',
      blog: userData.blog || '',
      description: '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
      background_image_url: '',
      profile_image_url: userData.profile_image_url || '',
      answer1: userData.answer1 || '기본 답변 1',
      answer2: userData.answer2 || '기본 답변 2',
      answer3: userData.answer3 || '기본 답변 3',
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
      liked: likedMembers[userData.nickname || ''] || false, // 좋아요 상태
      toggleLike: toggleLike, // 좋아요 상태 변경 함수 전달
    }] : [];

    const serverMembersArray = Array.isArray(serverMembers) ? serverMembers : []; // 서버 멤버 배열 확인
    
    return [...userMember, ...serverMembersArray];  // 사용자 멤버와 서버 멤버 데이터 결합하여 반환
  }, [isHubRegistered, userData, serverMembers, likedMembers]);

  const [filteredJob, setFilteredJob] = useState<string>('all'); // 필터링된 직업 상태

  // filteredJob 값에 따라 필터링된 멤버 목록 생성
  const filteredMembers = useMemo(() => {
    return filteredJob === 'all'
      ? allMembers.filter((member) => member.nickname) // 모든 멤버 반환
      : allMembers.filter(
          (member) => member.job_title?.toLowerCase() === filteredJob.toLowerCase() && member.nickname // 직업 필터링
        );
  }, [filteredJob, allMembers]);

  // 로딩 중 상태 처리
  if (isLoading) return <div>Loading...</div>;

  // 에러 발생 시 처리
  if (isError) {
    return <div>서버 오류: 데이터 로드 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-4 py-8">
          {/* 작은 화면에서 JobDirectory */}
        <div className="mb-6 lg:hidden">
          <JobDirectory setFilteredJob={setFilteredJob} className="w-full" /> 
        </div>

        {/* Member Cards */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {filteredMembers.map((member) => (
            <MemberCard key={member.nickname} {...member} /> // 멤버 카드 렌더링
          ))}
        </div>

        {/* 큰 화면에서 JobDirectory */}
        <div className="hidden lg:block lg:ml-10 lg:w-40">
          <JobDirectory setFilteredJob={setFilteredJob} />
        </div>
      </div>
    </div>
  );
};

export default GatherHubPage; 