import { PostFormState } from '@/components/PostForm/postFormTypes';
import type { Database } from '@/types/supabase';

export type SupabasePostRow = Database['public']['Tables']['Posts']['Row'];

// Supabase에서 가져온 게시글 데이터를 폼 상태(PostFormState) 형태로 변환
export const convertPostToFormState = (
  data: SupabasePostRow
): Partial<PostFormState> => ({
  title: data.title ?? '',
  category: data.category ?? '',
  place: data.place ?? '',
  location: data.location ?? '',
  duration: String(data.duration ?? ''),
  totalMembers: String(data.total_members ?? ''),
  personalLink: data.personal_link ?? '',
  targetPosition: (data.target_position ?? []).map((pos) => ({
    label: pos,
    value: pos,
  })),
  recruitmentCount: String(data.recruitmentCount ?? ''),
  techStack: (data.tech_stack ?? []).map((ts) => ({
    label: ts,
    value: ts,
  })),
  deadline: data.deadline ?? '',
  content: data.content ?? '',
});

// 폼 상태(PostFormState)를 Supabase에 저장 가능한 payload로 변환
export const convertFormStateToPostPayload = (
  state: PostFormState,
  userId: string
) => ({
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
  user_id: userId,
});