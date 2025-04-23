import { PostFormState } from "@/components/PostForm/postFormTypes";

const buildKey = (userId: string) => `draft_post_${userId}`;

// 유저별 임시 저장 글을 localStorage에 저장
export const saveDraftToStorage = (userId: string, draft: Partial<PostFormState>) => {
  try {
    const key = buildKey(userId);
    const value = JSON.stringify(draft);
    localStorage.setItem(key, value);
  } catch (err) {
    console.error('임시 저장 실패:', err);
  }
};

// 유저별 임시 저장 글을 localStorage에서 불러옴
export const loadDraftFromStorage = (userId: string): Partial<PostFormState> | null => {
  try {
    const key = buildKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as Partial<PostFormState>) : null;
  } catch (err) {
    console.error('임시 저장 불러오기 실패:', err);
    return null;
  }
};

// 유저별 임시 저장 글을 localStorage에서 삭제
export const clearDraftFromStorage = (userId: string) => {
  try {
    localStorage.removeItem(buildKey(userId));
  } catch (err) {
    console.error('임시 저장 삭제 실패:', err);
  }
};