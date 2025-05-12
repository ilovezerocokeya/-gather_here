import { useReducer, ChangeEvent } from 'react';
import { PostFormState, initialFormState, Option } from '@/components/PostForm/postFormTypes';
import { postFormReducer } from '../components/PostForm/reducer/postFormReducer';
import { supabase } from '@/utils/supabase/client';

interface UsePostFormReturn {
  state: PostFormState;
  handleInputChange: (key: keyof PostFormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleMultiSelectChange: (key: 'targetPosition' | 'techStack') => (selected: Option[]) => void;
  setAllFields: (values: Partial<PostFormState>) => void;
  resetForm: () => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
}

export const usePostForm = (defaultValues?: Partial<PostFormState>): UsePostFormReturn => {
  // 상태 초기화
  const [state, dispatch] = useReducer(
    postFormReducer,
    defaultValues ? { ...initialFormState, ...defaultValues } : initialFormState
  );

  // 단일 입력 필드 변경 핸들러
  const handleInputChange =
    (key: keyof PostFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      dispatch({ type: 'SET_FIELD', key, value: e.target.value });
    };

  // 다중 선택 필드 변경 핸들러
  const handleMultiSelectChange =
    (key: 'targetPosition' | 'techStack') => (selected: Option[]) => {
      dispatch({ type: 'SET_MULTISELECT', key, value: selected });
    };

  // 전체 필드 일괄 업데이트
  const setAllFields = (values: Partial<PostFormState>) => {
    dispatch({ type: 'SET_ALL', value: values });
  };

  // 폼 초기화
  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  // Supabase 유저 ID를 캐싱하여 draft 저장 키 생성
  let cachedUserId: string | null = null;

  const getDraftKey = async (): Promise<string | null> => {
    if (cachedUserId) return `draftPost_${cachedUserId}`;
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      cachedUserId = data.user.id;
      return `draftPost_${cachedUserId}`;
    }
    return null;
  };

  // 현재 폼 상태를 localStorage에 저장
  const saveDraft = async () => {
    const key = await getDraftKey();
    if (!key) return;

    const filteredState = Object.fromEntries(
      Object.entries(state).filter(([, v]) =>
        Array.isArray(v) ? v.length > 0 : !!v
      )
    ) as Partial<PostFormState>;

    localStorage.setItem(key, JSON.stringify(filteredState));
  };

  // localStorage에서 draft 불러와 상태 복원
  const loadDraft = async () => {
    const key = await getDraftKey();
    if (!key) return;

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<PostFormState>;
        dispatch({ type: 'SET_ALL', value: parsed });
      } catch (e) {
        console.error('Draft 복원 실패:', e);
      }
    }
  };

  return {
    state,
    handleInputChange,
    handleMultiSelectChange,
    setAllFields,
    resetForm,
    saveDraft,
    loadDraft,
  };
};