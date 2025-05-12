"use client";

import { useRouter } from 'next/navigation';
import { usePostForm } from '../../hooks/usePostForm';
import { validateDraft } from '@/lib/validation';
import { supabase } from '@/utils/supabase/client';
import PostFormInputs from './PostFormInputs';
import PostFormRecruit from './PostFormRecruit';
import PostFormEditor from './PostFormEditor';
import PostFormButtons from './PostFormButtons';
import PostFormModals from './PostFormModals';
import Toast from '@/components/Common/Toast/Toast';
import { convertFormStateToPostPayload } from '@/utils/postUtils/postFormUtils';
import { useEffect, useState } from 'react';
import { PostFormState } from './postFormTypes';
import { saveDraftToStorage, loadDraftFromStorage, clearDraftFromStorage } from '@/hooks/useDraftStorage';

interface PostFormWrapperProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<PostFormState>;
  postId?: string;
}

const PostFormWrapper = ({ mode, defaultValues, postId }: PostFormWrapperProps) => {
  const router = useRouter();

  // 폼 상태 및 관련 핸들러
  const {
    state,
    handleInputChange,
    handleMultiSelectChange,
    setAllFields,
  } = usePostForm(defaultValues);

  // 모달 및 토스트 상태
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [toast, setToast] = useState<{
    state: 'success' | 'error' | 'warn' | 'info' | 'custom';
    message: string;
  } | null>(null);

  // 토스트 메시지 표시 유틸
  const showToast = (state: 'success' | 'error' | 'warn' | 'info' | 'custom', message: string, duration = 2000) => {
    setToast({ state, message });
    setTimeout(() => setToast(null), duration);
  };

  // 로그인 여부 확인 (비로그인 시 로그인 모달 노출)
  const getUserOrShowLogin = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setShowLoginModal(true);
      return null;
    }
    return data.user;
  };

  // 게시글 제출 (작성 or 수정)
  const handleSubmit = async () => {
    // 필수값 누락 등 기본 유효성 검사
    const errorMessage = validateDraft(state);
    if (errorMessage) return showToast('error', errorMessage);

    // 로그인 유저 확인 (비로그인 상태면 로그인 모달 띄움)
    const user = await getUserOrShowLogin();
    if (!user) return;

    // 폼 상태를 Supabase DB에 맞는 payload 형태로 변환
    const payload = convertFormStateToPostPayload(state, user.id);

    if (mode === 'create') {
      // 게시글 신규 생성 요청
      const { data, error } = await supabase
        .from('Posts')
        .insert([payload])
        .select('post_id');

      // 실패 처리
      if (error) {
        console.error('게시글 생성 오류:', error.message);
        return showToast('error', '게시글 생성에 실패했어요.');
      }

      // 성공 시: 로컬 draft 삭제 및 상세 페이지 이동
      if (data?.[0]?.post_id) {
        clearDraftFromStorage(user.id);
        router.push(`/maindetail/${data[0].post_id}`);
      }
    } else if (mode === 'edit' && postId) {
      // 기존 게시글 수정 요청
      const { error } = await supabase
        .from('Posts')
        .update(payload)
        .eq('post_id', postId);

      if (error) {
        console.error('게시글 수정 오류:', error.message);
        return showToast('error', '게시글 수정에 실패했어요.');
      }

      // 수정 성공 시 해당 게시글 상세 페이지로 이동
      router.push(`/maindetail/${postId}`);
    }
  };

  // 임시 저장 핸들러
  const handleSaveDraft = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    // 작성된 내용이 있는 경우에만 저장
    const hasContent = Object.values(state).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    });

    if (!hasContent) {
      showToast('warn', '작성된 내용이 없어요!');
      return;
    }

    saveDraftToStorage(data.user.id, state);
    showToast('success', '임시 저장 완료!');
  };

  // 수정 모드에서 변경 사항이 있는지 확인
  const hasUnsavedChanges = (): boolean => {
    if (!defaultValues) return false; // 초기값이 없으면 비교할 수 없음
  
    const keys = Object.keys(state) as (keyof PostFormState)[];
  
    return keys.some((key) => {
      const current = state[key];           // 현재 입력된 값
      const original = defaultValues[key]; // 초기 입력값
    
      // 배열인 경우: JSON 문자열 비교로 변경 여부 확인
      if (Array.isArray(current) && Array.isArray(original)) {
        return JSON.stringify(current) !== JSON.stringify(original);
      }
    
      // 기본 타입(string, number 등)은 단순 비교
      return current !== original;
    });
  };

  // 마운트 시 임시 저장된 데이터 복원
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const storedDraft = loadDraftFromStorage(data.user.id);
      if (storedDraft) {
        setAllFields(storedDraft);
        showToast('info', '이전에 작성 중이던 글을 불러왔어요.');
      }
    };
    void init();
  }, []);

  return (
    <>
      {/* 로그인/나가기 모달 */}
      <PostFormModals
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        showExitModal={showExitModal}
        setShowExitModal={setShowExitModal}
        onExitConfirm={() => router.push('/')}
      />

      {/* 본문 영역 */}
      <div className="w-full max-w-[744px] mx-auto px-4 pt-6 pb-12">
        <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }} className="space-y-4">
          <PostFormInputs state={state} handleInputChange={handleInputChange} />
          <PostFormRecruit
            state={state}
            handleInputChange={handleInputChange}
            handleMultiSelectChange={handleMultiSelectChange}
          />
          <PostFormEditor content={state.content} handleContentChange={handleInputChange('content')} />
          <PostFormButtons
            onSaveDraft={() => void handleSaveDraft()}
            onExit={() => {
              if (mode === 'edit' && hasUnsavedChanges()) {
                setShowExitModal(true);
              } else if (mode === 'edit') {
                router.push(`/maindetail/${postId}`);
              } else {
                setShowExitModal(true);
              }
            }}
            mode={mode}
          />
        </form>
      </div>

      {/* 토스트 메시지 */}
      {toast && <Toast state={toast.state} message={toast.message} onClear={() => setToast(null)} />}
    </>
  );
};

export default PostFormWrapper;