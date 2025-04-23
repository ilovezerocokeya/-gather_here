'use client';

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
import { useEffect, useState } from 'react';
import { PostFormState } from './postFormTypes';
import {
  saveDraftToStorage,
  loadDraftFromStorage,
  clearDraftFromStorage,
} from '@/hooks/useDraftStorage';

interface PostFormWrapperProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<PostFormState>;
  postId?: string;
}

const PostFormWrapper = ({ mode, defaultValues, postId }: PostFormWrapperProps) => {
  const router = useRouter();
  const {
    state,
    handleInputChange,
    handleMultiSelectChange,
    setAllFields,
  } = usePostForm(defaultValues);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [toast, setToast] = useState<{
    state: 'success' | 'error' | 'warn' | 'info' | 'custom';
    message: string;
  } | null>(null);

  const showToast = (state: 'success' | 'error' | 'warn' | 'info' | 'custom', message: string, duration = 2000) => {
    setToast({ state, message });
    setTimeout(() => setToast(null), duration);
  };

  const getUserOrShowLogin = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setShowLoginModal(true);
      return null;
    }
    return data.user;
  };

  const buildPayload = () => ({
    title: state.title,
    category: state.category,
    place: state.place,
    location: state.location,
    duration: Number(state.duration),
    total_members: Number(state.totalMembers),
    personal_link: state.personalLink,
    target_position: state.targetPosition.map((pos) => pos.value),
    recruitmentCount: Number(state.recruitmentCount),
    tech_stack: state.techStack.map((ts) => ts.value),
    deadline: state.deadline,
    content: state.content,
  });

  const handleSubmit = async () => {
    const errorMessage = validateDraft(state);
    if (errorMessage) return showToast('error', errorMessage);

    const user = await getUserOrShowLogin();
    if (!user) return;

    const payload = { ...buildPayload(), user_id: user.id };

    if (mode === 'create') {
      const { data, error } = await supabase.from('Posts').insert([payload]).select('post_id');
      if (error) {
        console.error('게시글 생성 오류:', error.message);
        return showToast('error', '게시글 생성에 실패했어요.');
      }
      if (data?.[0]?.post_id) {
        clearDraftFromStorage(user.id);
        router.push(`/maindetail/${data[0].post_id}`);
      }
    } else if (mode === 'edit' && postId) {
      const { error } = await supabase.from('Posts').update(payload).eq('post_id', postId);
      if (error) {
        console.error('게시글 수정 오류:', error.message);
        return showToast('error', '게시글 수정에 실패했어요.');
      }
      router.push(`/maindetail/${postId}`);
    }
  };

  const handleSaveDraft = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
  
    // 작성된 값이 하나라도 있는지 확인
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
      <PostFormModals
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        showExitModal={showExitModal}
        setShowExitModal={setShowExitModal}
        onExitConfirm={() => router.push('/')}
      />
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
            onExit={() => setShowExitModal(true)}
            mode={mode}
            />
        </form>
      </div>

      {toast && <Toast state={toast.state} message={toast.message} onClear={() => setToast(null)} />}
    </>
  );
};

export default PostFormWrapper;
