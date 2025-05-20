'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CommonModal from '@/components/Common/Modal/CommonModal';
import SpinnerLoader from '@/components/Common/Loading/SpinnerLoader';
import MainDetailLayout from './MainDetailLayout';
import { useUserStore } from '@/stores/useUserStore';
import { Post, User } from '@/types/posts/Post.type';
import { UserData } from '@/types/userData';
import { deletePost } from '@/components/MainDetail/actions/deletePost';
import { useToastStore } from "@/stores/useToastStore";


interface MainDetailClientProps {
  post: Post;
  user: User;
}

const MainDetailClient: React.FC<MainDetailClientProps> = ({ post, user }) => {
  const router = useRouter();
  const { userData }: { userData: UserData | null } = useUserStore();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null); // 옵션 메뉴의 ref
  const { showToast } = useToastStore();
  
  // 옵션 메뉴 토글 핸들러
  const handleMoreOptions = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // 이벤트 버블링 방지
    setShowOptions((prev) => !prev);
  };

  // 옵션 메뉴 외부 클릭 시 닫기
  const handleClickOutside = (event: MouseEvent) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
      setShowOptions(false);
    }
  };

  // 외부 클릭 감지 이벤트 등록 및 해제
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 게시글 삭제 처리
  const handleDelete = async () => {
    if (!userData) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }

    const result = await deletePost(post.post_id, userData.user_id);
    if (!result.success) {
      showToast("게시글 삭제에 실패했습니다." , "error");
      return;
    }
    showToast("게시글이 삭제되었습니다." , "success");
    router.push('/');
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    setShowOptions(false);
    router.push(`/post/${post.post_id}`);
  };

    // 작성자인지 여부를 사전에 판단
    const isAuthor = useMemo(() => {
      return !!userData && userData.user_id === post.user_id;
    }, [userData, post.user_id]);

  
  const onBack = () => router.push('/'); // 뒤로가기 핸들러

  
  if (!post) return <SpinnerLoader />; // 게시글이 없을 경우 로딩 스피너 표시

  return (
    <>
      <MainDetailLayout
        post={post}
        user={user}
        userData={userData}
        showOptions={showOptions}
        optionsRef={optionsRef}
        handleMoreOptions={handleMoreOptions}
        setShowDeleteModal={setShowDeleteModal}
        onBack={onBack}
        handleEdit={handleEdit}
        showOptionsButton={isAuthor}
      />

      {showDeleteModal && (
        <CommonModal isOpen={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)}>
          <div className="p-4 text-center">
            <p className="text-lg font-semibold mb-4">정말 삭제하시겠어요?</p>
            <p className="text-sm text-labelNeutral mb-5">한번 삭제된 글은 다시 복구할 수 없어요.</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-fillNeutral rounded-lg text-primary">
                안 할래요
              </button>
              <button onClick={() => void handleDelete()} className="px-4 py-2 bg-primary rounded-lg text-fillNeutral">
                삭제할래요
              </button>
            </div>
          </div>
        </CommonModal>
      )}
    </>
  );
};

export default MainDetailClient;