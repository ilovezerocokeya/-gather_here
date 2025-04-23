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
  const [state, dispatch] = useReducer(
    postFormReducer,
    defaultValues ? { ...initialFormState, ...defaultValues } : initialFormState
  );

  const handleInputChange =
    (key: keyof PostFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      dispatch({ type: 'SET_FIELD', key, value: e.target.value });
    };

  const handleMultiSelectChange =
    (key: 'targetPosition' | 'techStack') => (selected: Option[]) => {
      dispatch({ type: 'SET_MULTISELECT', key, value: selected });
    };

  const setAllFields = (values: Partial<PostFormState>) => {
    dispatch({ type: 'SET_ALL', value: values });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

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