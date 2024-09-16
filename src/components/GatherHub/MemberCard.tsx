"use client";
import React, { useState } from 'react';

interface MemberCardProps {
  nickname: string;
  jobTitle: string;
  experience: string;
  description: string;
  backgroundImageUrl: string;
  profileImageUrl: string;
  blog: string;
  notionLink: string;
  instagramLink: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  nickname,
  jobTitle,
  experience,
  description,
  backgroundImageUrl,
  profileImageUrl,
  blog,
  notionLink,
  instagramLink,
}) => {
  // 좋아요 상태 관리
  const [liked, setLiked] = useState(false);
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  const socialLinks = [
    { name: 'Notion', url: notionLink, icon: '/assets/notion-icon.svg', color: 'text-gray-300 hover:text-white' },
    { name: 'Instagram', url: instagramLink, icon: '/assets/instagram-icon.svg', color: 'text-pink-500 hover:text-pink-600' },
    { name: 'Blog', url: blog, icon: '/assets/blog-icon.svg', color: 'text-blue-500 hover:text-blue-600' },
  ].filter(link => link.url);

  // 좋아요 버튼 클릭 핸들러
  const toggleLike = () => {
    setLiked(!liked);
  };

  // 모달 열기 핸들러
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="member-card bg-fillStrong p-6 rounded-[20px] shadow-lg relative w-[300px] h-[450px] flex flex-col justify-between">
        {/* 좌상단 좋아요 버튼 */}
        <div className="absolute top-2 left-2">
          <button
            onClick={toggleLike}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
          >
            {/* 좋아요 상태에 따른 아이콘 */}
            <img src={liked ? "/assets/liked-icon.svg" : "/assets/unliked-icon.svg"} alt="좋아요" className="w-5 h-5" />
          </button>
        </div>

        {/* 우상단 1:1 채팅 버튼 */}
        <div className="absolute top-2 right-2">
          <button className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100">
            <img src="/assets/chat-icon.svg" alt="채팅" className="w-5 h-5" />
          </button>
        </div>

        {/* 상단 포트폴리오 대표 이미지 */}
        <div className="relative mb-4">
          <div className="w-full h-[200px] bg-gray-300 rounded-t-[20px] overflow-hidden">
            {backgroundImageUrl ? (
              <img src={backgroundImageUrl} alt="포트폴리오" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          {/* 프로필 이미지 */}
          <div className="w-16 h-16 rounded-full bg-white border-4 border-fillStrong absolute bottom-[-24px] left-4 overflow-hidden">
            <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
          </div>

          {/* 프로필 보기 버튼 */}
          <div className="absolute bottom-[-24px] right-4">
            <button
              onClick={openModal}
              className="p-2 bg-primary text-white rounded-lg shadow hover:bg-primaryStrong transition"
            >
              프로필 보기
            </button>
          </div>
        </div>

        {/* 하단 멤버 정보 */}
        <div className="mt-2">
          <h3 className="text-xl font-bold text-fontWhite">{nickname}</h3>
          <p className="text-base text-primary mt-1">{jobTitle} | {experience}</p>
          <p className="mt-4 text-sm text-fontGray line-clamp-3">{description}</p>

          {/* 포트폴리오 링크 */}
          <div className="flex justify-start mt-6 space-x-6">
            {socialLinks.slice(0, 3).map((link, index) => (
              <a key={index} href={link.url} target="_blank" className={`flex flex-col items-center ${link.color}`}>
                <img src={link.icon} alt={link.name} className="w-5 h-5 mb-1" />
                <span className="text-xs">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-[400px]">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              &times;
            </button>

      {/* 모달 내용 */}
    <div className="flex items-start mt-5">
      <div className="w-24 h-24 rounded-full bg-white border-4 border-background overflow-hidden mb-4">
         <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
      </div>

      {/* 닉네임과 description */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-black">{nickname}님의 프로필</h2>
        <p className="text-black"><strong>분야:</strong> {jobTitle}</p>
        <p className="text-black"><strong>경력:</strong> {experience}</p>
      <hr className="my-4 border-t-2 border-gray-300 w-3/4 mx-auto" />
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md text-center">
          <p className="mt-2 text-black">{description}</p>
        </div>
      </div>
    </div>

      <div className="mt-4 flex justify-between text-center">      
        <a href={blog} target="_blank" className="text-gray-500 hover:underline">⭐️</a>
        <a href={notionLink} target="_blank" className="text-blue-500 hover:underline">Notion</a>
        <a href={instagramLink} target="_blank" className="text-pink-500 hover:underline">Instagram</a>
      </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberCard;