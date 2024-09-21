"use client";
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import JobDirectory from '@/components/GatherHub/JobDirectory';
import { useUser } from '@/provider/UserContextProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import { throttle } from 'lodash';
import axios from 'axios';

// MemberCard 컴포넌트를 동적으로 로드 (로딩 중에 표시할 내용 설정)
const MemberCard = React.memo(dynamic(() => import('@/components/GatherHub/MemberCard'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
}), (prevProps, nextProps) => prevProps.liked === nextProps.liked);

// 에러 상태 코드 상수화
const ERROR_STATUS = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};

// 스크롤 위치를 저장할 키
const SCROLL_POSITION_KEY = 'gatherHubScrollPosition'; 

// 유저 데이터 인터페이스 (유저의 응답 및 설명)
interface UserData {
  answer1?: string;
  answer2?: string;
  answer3?: string;
  description?: string;
}

// 멤버 카드의 인터페이스 정의
interface MemberCardProps {
  nickname: string;
  jobTitle: string;
  experience: string;
  backgroundImageUrl: string;
  profileImageUrl: string;
  blog: string;
  notionLink: string;
  instagramLink: string;
  liked: boolean;
  toggleLike: () => void;
  description: string;
  answer1: string;
  answer2: string;
  answer3: string;
}

// 유저 데이터의 기본값을 설정하는 함수
const getDefaultUserData = (userData: Partial<UserData>) => ({
  answer1: userData?.answer1 || '기본 답변 1',
  answer2: userData?.answer2 || '기본 답변 2',
  answer3: userData?.answer3 || '기본 답변 3',
  description: userData?.description || '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
});

// 필터링 로직을 함수로 분리
const filterMembers = (members: MemberCardProps[], job: string) => {
  return job === 'all'
    ? members.filter(member => member.nickname && member.jobTitle && member.profileImageUrl)
    : members.filter(member => member.jobTitle?.toLowerCase() === job && member.nickname && member.profileImageUrl);
};

// axios 인스턴스를 생성하여 요청 타임아웃을 설정
const axiosInstance = axios.create({
  timeout: 5000,  // 요청 타임아웃 5초로 설정
});

// 실제 유저 데이터를 서버로부터 페이징하여 가져오는 함수
const fetchRealMembers = async ({ pageParam = 1 }) => {
  try {
    const response = await axiosInstance.get(`/localhost:3000/gatherHub?page=${pageParam}&limit=10`);  // API 요청
    return {
      members: response.data.members,  // 서버로부터 가져온 멤버 데이터
      hasMore: response.data.hasMore,  // 더 불러올 데이터가 있는지 여부
      nextPage: response.data.hasMore ? pageParam + 1 : undefined,  // 다음 페이지 설정
    };
  } catch (error) {
    return { members: [], nextPage: undefined };  // 에러 발생 시 빈 데이터 반환
  }
};

// 목데이터 생성 (100명의 가짜 멤버 데이터)
const mockMembers = Array.from({ length: 100 }, (_, index) => ({
  nickname: `User${index + 1}`,
  jobTitle: ['Frontend', 'Backend', 'Design', 'PM', 'IOS', 'Android'][index % 6],
  experience: ['신입', '1년차', '2년차', '3년차', '4년차', '5년차', '6년차'][index % 4],
  backgroundImageUrl: '/logos/hi.png',
  profileImageUrl: '/path-to-profile-image',
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

// 실제 유저 데이터와 목데이터를 결합하여 페이징 처리하는 함수
const fetchMembers = async ({ pageParam = 1 }) => {
  const realData = await fetchRealMembers({ pageParam });  // 실제 데이터 호출
  const pageSize = 10;  // 페이지당 항목 수
  const startIndex = (pageParam - 1) * pageSize;  // 시작 인덱스
  const endIndex = pageParam * pageSize;  // 끝 인덱스
  const pageMockMembers = mockMembers.slice(startIndex, endIndex);  // 해당 페이지의 목데이터 추출
  const combinedMembers = Array.from(new Set([...realData.members, ...pageMockMembers]));  // 중복 제거 후 결합

  return {
    members: combinedMembers,  // 결합된 멤버 리스트
    nextPage: realData.nextPage || (endIndex < mockMembers.length ? pageParam + 1 : undefined),  // 다음 페이지 설정
  };
};

const GatherHubPage: React.FC = () => {
  const { userData } = useUser();  // 유저 데이터 가져오기
  const isHubRegistered = userData?.hubCard || false;  // Hub에 등록된 유저인지 확인
  const [likedMembers, setLikedMembers] = useState<{ [key: string]: boolean }>({});  // 좋아요 상태 관리
  const [filteredJob, setFilteredJob] = useState<string>('all');  // 필터링된 직업 상태 관리
  const hasNextPageRef = useRef<boolean | undefined>(undefined);  // 다음 페이지 여부 참조값
  const isFetchingNextPageRef = useRef<boolean>(false);  // 다음 페이지 fetching 여부 참조값
  const scrollContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨테이너 참조값

  // 데이터 페이징을 처리하는 React Query 사용
  const {
    data,
    fetchNextPage,  // 다음 페이지 데이터를 가져오는 함수
    hasNextPage,  // 다음 페이지가 있는지 여부
    isFetchingNextPage,  // 현재 다음 페이지를 fetching 중인지 여부
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['gatherHub', userData?.nickname],  // Query 키 설정
    queryFn: fetchMembers,  // 데이터를 가져오는 함수
    getNextPageParam: (lastPage) => lastPage.nextPage,  // 다음 페이지 파라미터
    staleTime: 60000,  // 1분간 데이터 캐싱
    initialPageParam: 1,  // 초기 페이지 파라미터
  });

  // 다음 페이지 여부 및 fetching 여부를 참조값에 저장
  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

   // 스크롤 위치 저장 함수
  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem(SCROLL_POSITION_KEY, scrollContainerRef.current.scrollTop.toString());
    }
  };

  // 스크롤 이벤트 핸들링
  useEffect(() => {
    const handleScroll = throttle(() => {
      saveScrollPosition();
      if (
        scrollContainerRef.current &&
        scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >=
          scrollContainerRef.current.scrollHeight - 200
      ) {
        if (hasNextPageRef.current && !isFetchingNextPageRef.current) {
          fetchNextPage();
        }
      }
    }, 300);
  
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchNextPage]);

  // 컴포넌트가 마운트될 때 스크롤 위치 복원
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (scrollContainerRef.current && savedScrollPosition) {
      scrollContainerRef.current.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
  }, []);

  // 모든 멤버 데이터를 합산하여 반환하는 함수
  const allMembers = useMemo(() => {
    let members = data?.pages?.flatMap(page => page.members) || [];
    if (isHubRegistered && userData?.nickname) {
      members.unshift({
        nickname: userData.nickname,
        jobTitle: userData.job_title,
        experience: userData.experience,
        blog: userData.blog,
        ...getDefaultUserData(userData),
        backgroundImageUrl: '',
        profileImageUrl: userData.profile_image_url,
        notionLink: 'https://www.notion.so/',
        instagramLink: 'https://www.instagram.com/',
        liked: likedMembers[userData.nickname] || false,
        toggleLike: () => setLikedMembers(prev => ({
          ...prev,
          [userData.nickname]: !prev[userData.nickname],
        })),
      });
    }
    return members;
  }, [isHubRegistered, userData, data, likedMembers]);

  // 필터링된 멤버 데이터를 반환하는 함수
  const filteredMembers = useMemo(() => filterMembers(allMembers, filteredJob), [allMembers, filteredJob]);

  // 데이터 로딩 중일 때
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-full h-48 bg-gray-200 animate-pulse"></div>
        ))}
      </div>
    );
  }

  // 에러 발생 시 처리 로직
if (error) {
  let errorMessage = '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === ERROR_STATUS.SERVER_ERROR) {
      errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (status === ERROR_STATUS.NOT_FOUND) {
      errorMessage = '요청하신 데이터를 찾을 수 없습니다.';
    } else if (status === ERROR_STATUS.UNAUTHORIZED || status === ERROR_STATUS.FORBIDDEN) {
      errorMessage = '접근 권한이 없습니다. 로그인 후 다시 시도해 주세요.';
    } else if (!error.response && error.request) {
      // request가 존재할 경우 네트워크 관련 오류일 가능성 처리
      errorMessage = '네트워크 문제가 발생했습니다. 연결을 확인해 주세요.';
    }
  } else {
    errorMessage = '알 수 없는 오류가 발생했습니다.';
  }
  return (
    <div>
      <p>{errorMessage}</p>
      <button onClick={() => fetchNextPage()}>다시 시도</button>
    </div>
  );
}

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-4 py-8" ref={scrollContainerRef}>
              
      {/* 작은 화면(모바일)에서는 JobDirectory를 상단에 표시 */}
        <div className="mb-6 lg:hidden">
          <JobDirectory setFilteredJob={setFilteredJob} className="w-full" />
        </div>

      
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {/* 필터링된 멤버 목록을 반복하여 렌더링 */}
          {filteredMembers.map((member, index) => (
            <MemberCard 
              key={`${member.nickname}-${index}`} 
              {...member} 
              liked={likedMembers[member.nickname] || false}
              toggleLike={() => setLikedMembers(prev => ({
                ...prev,
                [member.nickname]: !prev[member.nickname],
              }))}
              description={member.description || ''}  
              answer1={member.answer1 || ''}          
              answer2={member.answer2 || ''}          
              answer3={member.answer3 || ''}          
            />
          ))}

          {/* 다음 페이지 데이터를 fetching 중일 때 로딩 메시지 표시 */}
          {isFetchingNextPage && <div className="col-span-full">더 불러오는 중...</div>}

          {/* 더 이상 불러올 데이터가 없을 경우 */}
          {!hasNextPage && !isFetchingNextPage && (
            <div className="col-span-full">더 이상 데이터가 없습니다.</div>
          )}
        </div>

        {/* 큰 화면에서는 JobDirectory를 오른쪽에 표시 */}
        <div className="hidden lg:block lg:ml-10 lg:w-40">
          <JobDirectory setFilteredJob={setFilteredJob} />
        </div>
      </div>
    </div>
  );
};

export default GatherHubPage;