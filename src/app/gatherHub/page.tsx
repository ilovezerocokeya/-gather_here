"use client";
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import MemberCard from '@/components/GatherHub/MemberCard';
import JobDirectory from '@/components/GatherHub/JobDirectory';
import SkeletonCard from '@/components/GatherHub/SkeletonCard';
import { useUser } from '@/provider/UserContextProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import { throttle } from 'lodash';

// 멤버 카드의 인터페이스 정의
interface MemberCardProps {
  nickname: string;
  job_title: string;
  experience: string;
  background_image_url: string;
  profile_image_url: string;
  blog: string;
  notionLink: string;
  instagramLink: string;
  liked: boolean;
  description: string;
  answer1: string;
  answer2: string;
  answer3: string;
  }

// 필터링 로직을 함수로 분리
const filterMembers = (members: MemberCardProps[], job: string) => {
  return job === 'all'
    ? members.filter(member => member.nickname && member.job_title && member.profile_image_url)
    : members.filter(member => member.job_title?.toLowerCase() === job && member.nickname && member.profile_image_url);
  };

// // 유저 데이터를 페이지네이션으로 가져오는 함수
// const fetchMembers = async ({ pageParam = 1 }) => {
//   const response = await fetch(`/api/gatherHub?page=${pageParam}&limit=10`);
//   const data = await response.json();
  
//   return {
//     members: data.members, 
//     nextPage: pageParam + 1, // 다음 페이지 번호
//     hasNextPage: data.members.length > 0, // 더 로드할 페이지가 있는지 여부
//   };
// };

// // 유저 데이터를 페이지네이션으로 가져오는 함수 (목데이터 사용)
const fetchMembers = async ({ pageParam = 1 }) => {
  const mockMembers = Array.from({ length: 100 }, (_, index) => ({
    nickname: `User${index + 1}`,
    job_title: ['프론트엔드', '백엔드', '디자인', 'pm', 'ios', 'android'][index % 6], // 직업 데이터 추가
    experience: ['신입', '1년차', '2년차', '3년차', '4년차', '5년차', '6년차'][index % 4],
    background_image_url: '/logos/hi.png',
    profile_image_url: '/path-to-profile-image',
    blog: 'https://github.com/gather-here',
    notionLink: 'https://www.notion.so/',
    instagramLink: 'https://www.instagram.com/',
    liked: false,
    toggleLike: () => {},
    description: '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
    answer1: '기본 답변 1',
    answer2: '기본 답변 2',
    answer3: '기본 답변 3',
  }));

  const pageSize = 10; // 페이지당 10명의 데이터를 반환
  const startIndex = (pageParam - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMembers = mockMembers.slice(startIndex, endIndex);

  return {
    members: paginatedMembers,
    nextPage: pageParam + 1, // 다음 페이지 번호
    hasNextPage: endIndex < mockMembers.length, // 더 로드할 페이지가 있는지 여부
  };
};

const GatherHubPage: React.FC = () => {
  const { userData } = useUser();  // 사용자 데이터를 전역적으로 관리하기 위해 UserContext를 사용
  const isHubRegistered = userData?.hubCard || false; // 사용자가 hubCard를 등록했는지 확인
  const hasNextPageRef = useRef<boolean | undefined>(undefined);  // 다음 페이지 여부 참조값
  const [filteredJob, setFilteredJob] = useState<string>('all');  // 직업별 필터링 상태 관리
  const isFetchingNextPageRef = useRef<boolean>(false);  // 다음 페이지 fetching 여부 참조값

  
  // 무한 스크롤을 관리하기 위한 useInfiniteQuery 사용
  const {
    data,  // 서버에서 가져온 데이터
    fetchNextPage, // 다음 페이지 로드 함수
    hasNextPage, // 다음 페이지가 있는지 여부
    isLoading,
    isFetchingNextPage, // 다음 페이지를 로드 중인지 여부
    isError,
    refetch, // 에러 발생 시 다시 시도할 수 있게 사용
  } = useInfiniteQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,  // 데이터를 가져오는 함수
    getNextPageParam: (lastPage) => lastPage.nextPage,  // 다음 페이지 파라미터
    staleTime: 60000,  // 1분간 데이터 캐싱
    initialPageParam: 1,  // 초기 페이지 파라미터
  });

  const handleCardClick = (member: MemberCardProps) => {
    // 카드 클릭 시 현재 스크롤 위치를 세션 스토리지에 저장
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
  
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition'); // 세션 스토리지에서 'scrollPosition' 키로 저장된 값을 가져옴
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, []);
  
  // 다음 페이지 여부 및 fetching 여부를 참조값에 저장
  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    // 필터링이 변경될 때마다 스크롤을 맨 위로 즉시 이동
    if (filteredJob !== 'all') {
      window.scrollTo(0, 0); // 스크롤을 맨 위로 즉시 이동
    }
  }, [filteredJob]);

  // 스크롤 이벤트 핸들링
  useEffect(() => {
    const handleScroll = throttle(() => {
      // 필터가 "all"일 때만 무한 스크롤이 동작하도록 조건을 추가
      if (filteredJob === 'all' && window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
        if (hasNextPageRef.current && !isFetchingNextPageRef.current) {
          fetchNextPage();
        }
      }
    }, 300);

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [fetchNextPage, filteredJob]); 

  // 좋아요 상태 관리
  const [likedMembers, setLikedMembers] = useState<{ [key: string]: boolean }>({});

  // 좋아요 상태를 변경하는 함수
  const toggleLike = useCallback((nickname: string) => {
    setLikedMembers((prevLikedMembers) => ({
      ...prevLikedMembers,
      [nickname]: !prevLikedMembers[nickname], 
    }));
  }, []);

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

    // 서버에서 가져온 멤버 데이터를 포함하여 전체 멤버 목록을 반환
    const serverMembers = data?.pages.flatMap(page => page.members) || [];

    return [...userMember, ...serverMembers];  // 사용자 멤버와 서버 멤버 데이터 결합하여 반환
  }, [isHubRegistered, userData, data, likedMembers]);

  // 필터링된 멤버 데이터를 반환하는 함수
  const filteredMembers = useMemo(() => filterMembers(allMembers, filteredJob), [allMembers, filteredJob]);

  // 로딩 중 상태 처리
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  // 에러 발생 시 처리
  if (isError) {  
    return (
      <div className="text-center text-red-500">
        서버 오류: 데이터를 로드 중 문제가 발생했습니다.
        <button
          onClick={() => refetch()}
          className="bg-red-500 text-white p-2 rounded-md mt-4"
        >
          다시 시도
        </button>
      </div>
    );
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
          {filteredMembers.map((member, index) => (
            <div key={`${member.nickname}-${index}`} onClick={() => handleCardClick(member)}> {/* 각 멤버 카드 클릭 시 handleCardClick 함수가 호출되어 스크롤 위치 저장 */}
            <MemberCard 
              {...member} // member 객체의 모든 속성을 MemberCard 컴포넌트로 전달
              liked={likedMembers[member.nickname] || false} // 좋아요 상태를 liked 속성으로 전달
              toggleLike={() => setLikedMembers(prev => ({ // 좋아요 상태 변경 함수
                ...prev,
                [member.nickname]: !prev[member.nickname],
              }))}
            />
          </div>
        ))}

        {/* 더 많은 멤버를 불러오는 중일 때 스켈레톤 카드 표시 */}
          {isFetchingNextPage && (
            <>
              {Array.from({ length: 9 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </>
          )}

        {isFetchingNextPage && 
        <div 
          className="col-span-full">더 불러오는 중...
        </div>
        }

        {/* 더 이상 불러올 데이터가 없을 경우 */}
        {!hasNextPage && !isFetchingNextPage && (
          <div className="col-span-full">더 이상 데이터가 없습니다.</div>
        )} 
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