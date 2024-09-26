//MemberCard

"use client";
import { useUser } from '@/provider/UserContextProvider';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

// MemberCardProps: 멤버 카드 컴포넌트에서 필요한 속성들을 정의하는 인터페이스
interface MemberCardProps {
  nickname: string;
  job_title: string;
  experience: string;
  description: string;
  background_image_url: string;
  profile_image_url: string;
  blog: string; // 대표 포트폴리오
  answer1: string; 
  answer2: string; 
  answer3: string; 
  notionLink: string;
  instagramLink: string;
  liked: boolean;
  toggleLike: (nickname: string) => void;
}

// MemberCard: 각 멤버의 정보를 카드 형태로 렌더링하는 컴포넌트
const MemberCard: React.FC<MemberCardProps> = ({
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
  notionLink,
  instagramLink,
}) => {
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); 
  
  // 좋아요 상태와 함수 사용
  const { likedMembers, toggleLike } = useUser(); 
  const liked = likedMembers[nickname] || false;

 // 소셜 링크를 useMemo로 최적화
 const socialLinks = useMemo(() => {
  return [
    { name: '🔥', url: blog, color: 'text-blue-500 hover:text-blue-600' },
    { name: 'Notion', url: notionLink, icon: '/assets/notion-icon.svg', color: 'text-gray-300 hover:text-white' },
    { name: 'Instagram', url: instagramLink, icon: '/assets/instagram-icon.svg', color: 'text-pink-500 hover:text-pink-600' },
  ].filter(link => link.url);
}, [notionLink, instagramLink, blog]);

  // 모달 열기 핸들러
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
  };

// 모달이 열렸을 때 Esc 키로 모달 닫기 및 스크롤 처리
useEffect(() => {
  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal(); // Esc 키를 누르면 모달을 닫음
    }
  };

  if (isModalOpen) {
    // 모달이 열렸을 때 스크롤 막기
    document.body.style.overflow = 'hidden';
    // Esc 키 이벤트 리스너 추가
    window.addEventListener("keydown", handleEsc);
  } else {
    // 모달이 닫히면 스크롤 복구
    document.body.style.overflow = 'auto';
  }

  return () => {
    window.removeEventListener("keydown", handleEsc);
    document.body.style.overflow = 'auto'; // 스크롤 복구
  };
}, [isModalOpen, closeModal]);

return (
  <>
  <div
    className="member-card bg-fillStrong rounded-[20px] shadow-lg relative w-[300px] h-[460px] flex flex-col justify-between z-30 user-select-none"
    style={{ userSelect: 'none' }}
  >
    {/* 좌상단 좋아요 버튼 */}
    <div className="absolute top-2 left-6 z-10">
      <button
        onClick={() => toggleLike(nickname)}
        className="p-2 rounded-2xl bg-black border-2 border-black shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-110"
        style={{ userSelect: 'none' }} 
      >
        <Image
          src={liked ? '/assets/bookmark2.svg' : '/assets/bookmark1.svg'}
          alt="좋아요"
          width={5}
          height={5}
          className="w-5 h-5"
        />
      </button>
    </div>

    {/* 우상단 1:1 채팅 버튼 */}
    <div className="absolute top-2 right-6 group z-10">
      <button
        className="p-2 rounded-2xl bg-black border-2 border-black shadow-lgtransition-transform duration-200 ease-in-out transform hover:scale-110"
        style={{ userSelect: 'none' }} 
      >
        <Image
          src="/assets/chat.svg"
          alt="채팅"
          width={5}
          height={5}
          className="w-5 h-5"
        />
      </button>
      {/* 말풍선 효과 */}
      <div
        className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-yellow-500 text-black text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
        style={{ userSelect: 'none' }} 
      >
        <strong>{nickname}</strong>님과 채팅해보세요!
        <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45"></div>
      </div>
    </div>

    {/* 대표 포트폴리오 이미지 */}
    <div className="relative mb-4">
      <div
        className="w-full h-[250px] bg-gray-300 rounded-t-[20px] overflow-hidden cursor-pointer group"
        onClick={() => window.open(blog, '_blank')}
        style={{ userSelect: 'none' }} 
      >
        {background_image_url ? (
          <Image
            src={background_image_url}
            alt="포트폴리오"
            width={300}
            height={40}
            className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <Image
            src="/logos/hi.png"
            alt="기본 이미지"
            width={300}
            height={40}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            style={{ width: '300px', height: 'auto' }}
          />
        )}
        {/* 말풍선 효과 */}
        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-yellow-500 text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          구경하기
          <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45 rounded-sm shadow-lg"></div>
        </div>
      </div>
    </div>

    {/* 프로필 보기 버튼 */}
    <div className="absolute bottom-[185px] p-2 right-4">
      <button
        onClick={openModal}
        className="p-2 bg-primary text-black rounded-lg shadow hover:bg-primaryStrong transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
        style={{ userSelect: 'none' }} 
      >
        프로필 보기
      </button>
    </div>

    {/* 프로필 이미지 */}
    <div
      className="w-30 h-30 rounded-2xl flex items-center justify-center border-2 bg-black border-black absolute bottom-[180px] left-4 overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
      onClick={() => setIsProfileModalOpen(true)}
      style={{ userSelect: 'none' }} 
    >
      <div className="relative w-20 h-20"> 
        <Image
          src={profile_image_url}
          alt={nickname}
          fill
          sizes="20vw"
          className="object-cover rounded-2xl shadow-lg"
          priority
        />
      </div>
    </div>

    {/* 프로필 이미지 확대 모달 */}
    {isProfileModalOpen &&
      createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]"
          onClick={() => setIsProfileModalOpen(false)}
          style={{ userSelect: 'none' }}
        >
          <div className="relative">
            <Image
              src={profile_image_url || ''}
              alt={nickname}
              width={500}
              height={500}
              className="s:w-[340px] s:h-[340px] h-[500px] w-[500px] object-cover rounded-2xl shadow-lg border-4 border-white"
            />
            <button
              className="absolute top-2 right-2 text-black text-2xl font-bold rounded-full p-2 hover:text-gray-800 hover:scale-110 transition-transform duration-200 ease-in-out"
              onClick={() => setIsProfileModalOpen(false)}
              style={{ userSelect: 'none' }} 
            >
              &times;
            </button>
          </div>
        </div>,
        document.body
      )}
      {/* 하단 멤버 정보 */}
      <div className="mt-2 p-6 user-select-none " >
         <h3 className="text-xl font-bold text-fontWhite">{nickname}</h3>
         <p className="text-base text-primary mt-1">{job_title} | {experience}</p>
         <p
          className="mt-4 text-sm text-fontGray line-clamp-1 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
          onClick={openModal}
        >
          {description}
        </p>

        {/* 포트폴리오 링크 */}
        <div className="flex justify-start mt-3 space-x-4" style={{ userSelect: 'none' }}>
          {/* 대표 포트폴리오 링크 */}
          <a
            href={blog}
            target="_blank"
            className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
            style={{ userSelect: 'none' }}
          >
            <span className="text-xl">⭐️</span> 
          </a>

          {/* first_link 자리 */}
          <a
            href={notionLink || 'first_link'}
            target="_blank"
            className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
            style={{ userSelect: 'none' }}
          >
            <Image
              src={"/logos/github.svg"}
              alt="포폴2"
              width={24} 
              height={24} 
              className="w-6 h-6" 
            />
          </a>

          {/* second_link 링크 자리 */}
          <a
            href={instagramLink || 'second_link'}
            target="_blank"
            className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
            style={{ userSelect: 'none' }}
          >
            <Image
              src={"/logos/google.svg"}
              alt="포폴3"
              width={24}  
              height={24} 
              className="w-6 h-6" 
            />
          </a>
        </div>
       </div>
      </div>
      
  {/* 모달 창 */}
  {isModalOpen &&
    createPortal(
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
        onClick={closeModal}
        style={{ userSelect: 'none' }} 
      >
        <div
          className="bg-background rounded-3xl shadow-lg s:w-[400px] s:h-[600px] w-[550px] h-[700px] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-95 opacity-0"
          style={{
            opacity: isModalOpen ? 1 : 0,
            transform: isModalOpen ? 'scale(1)' : 'scale(0.95)',
            userSelect: 'none', 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-black text-3xl font-bold rounded-full p-4 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out z-50"
            onClick={closeModal}
            style={{ userSelect: 'none' }} 
          >
            &times;
          </button>

        {/* 대표 포트폴리오 이미지 */}
        <div
          className="relative h-[300px] bg-gray-200 rounded-t-[20px] overflow-hidden cursor-pointer"
          onClick={() => window.open(blog, '_blank')}
          style={{ userSelect: 'none' }} 
        >
          {background_image_url ? (
            <Image
              src={background_image_url}
              alt="배경 이미지"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // 적절한 sizes 추가
              priority
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <Image
              src="/logos/hi.png"
              alt="기본 이미지"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // 적절한 sizes 추가
              priority
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </div>

        {/* 프로필 정보 */}
        <div className="relative">
          <div className="absolute -top-20 flex flex-col items-start p-6"> 
            <div className="w-28 h-28 rounded-2xl bg-white border-4 border-background overflow-hidden"> 
              <div className="relative w-28 h-28">
                <Image
                  src={profile_image_url}
                  alt={nickname}
                  fill
                  sizes="24vw"
                  className="object-cover rounded-2xl shadow-lg"
                  priority
                />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-#3e3e3d">{nickname}</h2>
              <p className="text-primary text-ml">{job_title} | {experience}</p>
            </div>
          </div>

          {/* 좋아요 & 1:1채팅 버튼 */}
          <div className="absolute -top-10 right-0 flex items-center space-x-4 p-6">
          <button
            onClick={() => toggleLike(nickname)}
            className={`p-3 rounded-lg transition flex items-center space-x-2 ${liked ? 'bg-gray-700 text-primary' : 'bg-gray-700 text-white'} hover:bg-gray-900`}
            style={{ userSelect: 'none' }} 
          >
            <Image
              src={liked ? '/assets/bookmark2.svg' : '/assets/bookmark1.svg'}
              alt="좋아요"
              width={5}
              height={5}
              className="w-5 h-5"
            />
            <span className={`hidden md:block ${liked ? 'text-primary' : 'text-white'}`}>북마크</span>
          </button>

            <button
              className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition flex items-center space-x-2"
              onClick={closeModal}
              style={{ userSelect: 'none' }}
            >
              <Image
                src="/assets/chat.svg"
                alt="메시지 아이콘"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="hidden md:block">1:1채팅</span>
            </button>
          </div>
        </div>

        <div className="w-240px border-t border-gray-500 border-opacity-40 mt-40 mx-5"></div>

        {/* 자기소개 섹션 */}
        <div className="p-6 flex items-start space-x-16">
          {/* 왼쪽: 자기소개 제목 */}
          <div className="flex-shrink-0">
            <h3 className="text-ml text-#3e3e3d">자기소개</h3>
          </div>
          {/* 오른쪽: 자기소개 내용 */}
          <div className="flex-grow bg-fillLight p-4 rounded-lg">
            <p className="text-gray-300">{description}</p>
          </div>
        </div>

        <div className="w-240px border-t border-gray-500 border-opacity-40 mt-30 mx-5"></div>

        {/* 공통 질문 섹션 */}
        <div className="p-6 flex items-start space-x-16">

          {/* 왼쪽: 공통 질문 제목 */}
          <div className="flex-shrink-0">
            <h3 className="text-ml text-#3e3e3d">공통 질문</h3>
          </div>

          {/* 오른쪽: 공통 질문 답변 */}
          <div className="flex-grow space-y-6">

            {/* 첫 번째 질문 */}
            <div className="flex items-start flex-col space-y-2">
              <div className="flex-shrink-0">
                {/* 화면 크기에 따라 텍스트 크기 변경 */}
                <h4 className="text-xs md:text-base lg:text-lg font-bold text-#3e3e3d">
                  1️. 팀으로 일할 때 나는 어떤 팀원인가요?
                </h4>
              </div>
              <div className="w-full bg-fillLight p-4 rounded-lg">
                <p className="text-xs md:text-sm lg:text-base text-gray-300">{answer1}</p>
              </div>
            </div>

            {/* 두 번째 질문 */}
            <div className="flex items-start flex-col space-y-2">
              <div className="flex-shrink-0">
                <h4 className="text-xs md:text-base lg:text-lg font-bold text-#3e3e3d">
                  2️. 팀과 목표를 이루기 위해 가장 중요한 것은 무엇인가요?
                </h4>
              </div>
              <div className="w-full bg-fillLight p-4 rounded-lg">
                <p className="text-xs md:text-sm lg:text-base text-gray-300">{answer2}</p>
              </div>
            </div>
            
            {/* 세 번째 질문 */}
            <div className="flex items-start flex-col space-y-2">
              <div className="flex-shrink-0">
                <h4 className="text-xs md:text-base lg:text-lg font-bold text-#3e3e3d">
                  3️. 자신의 부족한 부분을 어떻게 보완했나요?
                </h4>
              </div>
              <div className="w-full bg-fillLight p-4 rounded-lg">
                <p className="text-xs md:text-sm lg:text-base text-gray-300">{answer3}</p>
              </div>
            </div>
          </div>
        </div>

      <div className="w-240px border-t border-gray-500 border-opacity-40 mt-30 mx-5"></div>

          {/* 기술스택 섹션 */}
          <div className="p-6 flex items-start space-x-16">
           {/* 왼쪽: 기술스택 제목 */}
           <div className="flex-shrink-0">
             <h3 className="text-ml text-#3e3e3d">기술스택</h3>
           </div>
           {/* 오른쪽: 기술스택 */}
          <div>
            JavaScript, TypeScript, React, NEXT.JS
          </div>
         </div>

         <div className="w-240px border-t border-gray-500 border-opacity-40 mt-30 mx-5"></div>

        {/* 포트폴리오 섹션 */}
        <div className="p-6 flex items-start space-x-24">
          {/* 왼쪽: 기술스택 제목 */}
          <div className="flex-shrink-0">
            <h3 className="text-ml text-#3e3e3d">URL</h3>
          </div>
          
          {/* 오른쪽: 포트폴리오 링크 */}
          <div className="flex space-x-4">

            {/* 첫 번째 포트폴리오 링크 */}
            <a
              href={blog}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1 text-blue-500 hover:underline transition-transform duration-300 hover:scale-105"
              style={{ userSelect: 'none' }}
            >
              <span className="text-3xl">⭐️</span>         
            </a>
            {/* 두 번째 포트폴리오 링크 */}
            <a
              href={notionLink || 'first_link'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1 text-green-500 hover:underline transition-transform duration-300 hover:scale-105"
              style={{ userSelect: 'none' }}
            >
              <Image
                src="/logos/github.svg" 
                alt="first_link_type"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </a>
            {/* 세 번째 포트폴리오 링크 */}
            <a
              href={instagramLink || 'second_link'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1 text-pink-500 hover:underline transition-transform duration-300 hover:scale-105"
              style={{ userSelect: 'none' }}
            >
              <Image
                src="/logos/google.svg" 
                alt="second_link_type"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </a>

          </div>
          
        </div>
      </div>
    </div>,
  document.body
    )}
</>
  );
};

export default MemberCard;
