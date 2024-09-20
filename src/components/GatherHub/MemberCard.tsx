//MemberCard

"use client";
import { useUser } from '@/provider/UserContextProvider';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

// MemberCardProps: 멤버 카드 컴포넌트에서 필요한 속성들을 정의하는 인터페이스
interface MemberCardProps {
  nickname: string;
  jobTitle: string;
  experience: string;
  description: string;
  backgroundImageUrl: string;
  profileImageUrl: string;
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
  jobTitle,
  experience,
  description,
  backgroundImageUrl,
  profileImageUrl,
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
    <div className="member-card bg-fillStrong rounded-[20px] shadow-lg relative w-[300px] h-[460px] flex flex-col justify-between z-30 user-select-none">
        
        {/* 좌상단 좋아요 버튼 */}
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={() => toggleLike(nickname)}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100
            transition-transform duration-200 ease-in-out transform hover:scale-110"
          >
            <img 
              src={liked ? "/assets/liked-icon.svg" : "/assets/unliked-icon.svg"} 
              alt="좋아요" 
              className="w-5 h-5" 
            />
          </button>
        </div>

        {/* 우상단 1:1 채팅 버튼 */}
        <div className="absolute top-2 right-2 group z-10">
          <button 
            className="p-2 rounded-full bg-white shadow-lg
             hover:bg-gray-100 transition-transform duration-200 ease-in-out transform hover:scale-110"
          >
            <img src="/assets/chat-icon.svg" alt="채팅" className="w-5 h-5" />
          </button>
          {/* 말풍선 효과 */}
          <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-yellow-500 text-black text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              <strong>{nickname}</strong>님과 채팅해보세요!
          {/* 말풍선 꼬리 */}
            <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45"></div>
          </div>
        </div>

          {/* 상단 포트폴리오 대표 이미지 */}
        <div className="relative mb-4">
            <div 
              className="w-full h-[250px] bg-gray-300 rounded-t-[20px] overflow-hidden cursor-pointer group"
              onClick={() => window.open(blog, '_blank')}
            >
              {backgroundImageUrl ? (
                <img 
                  src={backgroundImageUrl} 
                  alt="포트폴리오" 
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" 
                />
              ) : (
                <Image 
                  src="/logos/hi.png" 
                  alt="기본 이미지" 
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" 
                />
              )}
            {/* 말풍선 효과 */}
            <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-yellow-500 text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                구경하기
              {/* 말풍선 꼬리 */}
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45 rounded-sm shadow-lg"></div>
            </div>
          </div>

          {/* 프로필 */}
          <div className="w-16 h-16 p-6 rounded-full bg-white border-4 border-fillStrong absolute bottom-[-24px] left-4 overflow-hidden">
            <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
          </div>

          {/* 프로필 보기 버튼 */}
          <div className="absolute bottom-[-24px] p-2 right-4">
            <button
              onClick={openModal}
              className="p-2 bg-primary text-black rounded-lg shadow hover:bg-primaryStrong transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              프로필 보기
            </button>
          </div>
          
          {/* 프로필 이미지 */}
          <div className="w-16 h-16 rounded-full bg-white p-5 border-4 border-fillStrong absolute bottom-[-24px] left-4 overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
               onClick={() => setIsProfileModalOpen(true)}
          >
            <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 프로필 이미지 확대 모달 */}
        {isProfileModalOpen && createPortal(
        <div
           className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]"
           onClick={() => setIsProfileModalOpen(false)}
         >
          <div className="relative">
            <img
              src={profileImageUrl || ''}
              alt={nickname}
              className="s:w-[340px] w-[500px] s:h-[340px] h-[500px] object-cover rounded-full shadow-lg border-4 border-white"
            />
              <button
                className="absolute top-2 right-2 text-gray-400 text-2xl font-bold rounded-full p-2 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out shadow-lg"
                onClick={() => setIsProfileModalOpen(false)}
              >
                &times;
              </button>
          </div>
        </div>,
        document.body
       )}

          {/* 하단 멤버 정보 */}
       <div className="mt-2 p-6 user-select-none">
          <h3 className="text-xl font-bold text-fontWhite">{nickname}</h3>
          <p className="text-base text-primary mt-1">{jobTitle} | {experience}</p>
          <p className="mt-4 text-sm text-fontGray line-clamp-1 cursor-pointer" 
            onClick={openModal}
          >
            {description}
          </p>

         {/* 포트폴리오 링크 */}
          <div className="flex justify-center p-5 space-x-6">
            {socialLinks.slice(0, 3).map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                className={`flex flex-col items-center ${link.color} transition-transform duration-200 ease-in-out transform hover:scale-110`}
              >
              <img src={link.icon} alt={link.name} className="w-5 h-5 mb-1" />
              <span className="text-xs">{link.name}</span>
              </a>
            ))}
        </div>
       </div>
    </div>

  {/* 모달 창 */}
  {isModalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out user-select-none"
    onClick={closeModal}
  >
    <div
      className="bg-background rounded-3xl shadow-lg s:w-[400px] s:h-[600px] w-[600px] h-[700px] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-95 opacity-0"
      style={{ opacity: isModalOpen ? 1 : 0, transform: isModalOpen ? "scale(1)" : "scale(0.95)" }}
      onClick={(e) => e.stopPropagation()}
    > 
      <button
        className="absolute top-2 right-2 text-black text-3xl font-bold rounded-full p-4 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out z-50"
        onClick={closeModal}
      >
        &times;
      </button>

      {/* 상단 배경 이미지 */}
      <div
        className="relative h-[300px] bg-gray-200 rounded-t-[20px] overflow-hidden cursor-pointer"
        onClick={() => window.open(blog, '_blank')}
      >
        <img 
          src={backgroundImageUrl} 
          alt="배경 이미지" 
          className="absolute inset-0 w-full h-full object-cover object-center" 
        />
      </div>

      {/* 프로필 정보 */}
      <div className="relative flex flex-col items-center -mt-12">
        <div className="w-36 h-36 rounded-full p-14 bg-white border-4 border-background overflow-hidden">
          <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-white">{nickname}</h2>
        <p className="text-primary text-lg">{jobTitle} | {experience}</p>
      </div>

      {/* 좋아요와 메시지 보내기 버튼 */}
      <div className="flex justify-center space-x-4 mt-4">
        <button 
          onClick={() => toggleLike(nickname)}
          className="bg-gray-700 text-white p-6 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
        >
          <img src="/assets/liked-icon.svg" alt="좋아요 아이콘" className="w-5 h-5" />
          <span>좋아요</span>
        </button>

        <button 
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
          onClick={closeModal}
        >
          <img src="/assets/message-icon.svg" alt="메시지 아이콘" className="w-5 h-5" />
          <span>1:1채팅</span>
        </button>
      </div>

      {/* 자기소개 */}
      <div className="mt-6 text-center p-6">
        <p className="text-white">{description}</p>
      </div>

      {/* 소셜 링크 */}
      <div className="mt-4 flex justify-center space-x-4">
    {/* Blog (대표 포트폴리오) 링크 */}
        {blog && (
          <a href={blog} target="_blank" className="flex items-center space-x-2 text-blue-500 hover:underline">
            <span className="text-3xl">🔥</span>
          </a>
        )}
        {/* Notion 링크 */}
        {notionLink && (
          <a href={notionLink} target="_blank" className="flex items-center space-x-2 text-green-500 hover:underline">
            <img src="/assets/notion-icon.svg" alt="Notion 아이콘" className="w-5 h-5" />
            <span>Notion</span>
          </a>
        )}

        {/* Instagram 링크 */}
        {instagramLink && (
          <a href={instagramLink} target="_blank" className="flex items-center space-x-2 text-pink-500 hover:underline">
            <img src="/assets/instagram-icon.svg" alt="Instagram 아이콘" className="w-5 h-5" />
            <span>Instagram</span>
          </a>
        )}

      </div>

      {/* 질문과 답변 섹션 */}
      <div className="mt-6 p-6">
        <h3 className="text-lg font-bold text-white">✅ 공통 질문</h3>
        <p className="text-white mt-3"> ↪️ 서로를 더 알아갈 수 있도록 공통 질문을 준비했어요</p>
        <br />
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="text-md font-bold text-white">1️⃣ 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.</h4>
            <p className="bg-gray-200 p-4 rounded-lg mt-2 text-black">{answer1}</p>
          </div>
          <div>
            <h4 className="text-md font-bold text-white">2️⃣ 팀과 함께 목표를 이루기 위해 무엇이 가장 중요하다고 생각하는지 알려 주세요.</h4>
            <p className="bg-gray-200 p-4 rounded-lg mt-2 text-black">{answer2}</p>
          </div>
          <div>
            <h4 className="text-md font-bold text-white">3️⃣ 자신이 부족하다고 느낀 부분을 어떻게 보완하거나 학습해 왔는지 이야기해 주세요.</h4>
            <p className="bg-gray-200 p-4 rounded-lg mt-2 text-black">{answer3}</p>
          </div>
        </div>
      </div>

      {/* 하단 확인 버튼 */}
      <div className="mt-2 flex justify-center space-x-4 p-6">
        <button 
          className="bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary transition"
          onClick={closeModal}
        >
          확인
        </button>
      </div>
    </div>
  </div>
)}
  </>
  );
};

export default MemberCard;
