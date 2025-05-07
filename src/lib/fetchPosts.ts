import { supabase } from '@/utils/supabase/client';
import {
  PostWithUser,
  ITEvent,
  FetchPostsFilters,
  FetchPostsOptions,
  FetchEventsPostsOptions,
} from '@/types/posts/Post.type';
import { Tables } from '@/types/supabase';

// 일반 게시글 조회 함수
export const fetchPosts = async (
  page: number,
  category?: string,
  filters: FetchPostsFilters = {},
  options: FetchPostsOptions = {},
): Promise<PostWithUser[]> => {
  const postsPerPage = 10;

  // 오늘 날짜 기준으로 마감일 이후의 게시글만 조회
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formattedToday = today.toISOString();

  // 페이지네이션 계산
  const start = (page - 1) * postsPerPage;

  // 기본 쿼리: 마감일 이후 + 유저 정보 join
  const query = supabase
    .from('Posts')
    .select(
      `
      *,
      user:Users!Posts_user_id_fkey (
        nickname,
        email,
        profile_image_url
      )
    `,
    )
    .gte('deadline', formattedToday);

  // 조건별 필터링 적용
  if (category) {
    query.eq('category', category);
  }
  if (filters.targetPosition && filters.targetPosition.length > 0) {
    query.contains('target_position', filters.targetPosition);
  }
  if (filters.place && filters.place !== '') {
    query.eq('place', filters.place);
  }
  if (filters.location && filters.location !== '') {
    query.eq('location', filters.location);
  }
  if (filters.duration !== null && filters.duration !== undefined) {
    if (filters.duration.gt !== undefined) {
      query.gt('duration', filters.duration.gt);
    }
    if (filters.duration.lte !== undefined) {
      query.lte('duration', filters.duration.lte);
    }
  }
  if (filters.user_id) {
    query.eq('user_id', filters.user_id);
  }

  // 정렬 및 범위 설정
  query.order(options.order?.column ?? 'created_at', { ascending: options.order?.ascending ?? false });
  query.range(start, start + postsPerPage - 1);

  // 쿼리 실행
  const { data, error } = await query;

  if (error) throw new Error(error.message);

  // Supabase join 결과가 배열일 수 있어서 정제
  const formatted = (data ?? []).map((post) => {
    const user = Array.isArray(post.user)
      ? (post.user[0] as PostWithUser['user'])
      : (post.user as PostWithUser['user']);

    return {
      ...(post as Omit<PostWithUser, 'user'>),
      user,
    };
  });

  return formatted;
};

// 마감일 기반 게시글 조회
export const fetchPostsWithDeadLine = async (days: number, category?: string): Promise<PostWithUser[]> => {
  const today = new Date(); // 오늘 날짜 생성

  // 오늘 기준으로 전달받은 days 만큼 더한 미래 날짜 계산
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  // 날짜를 YYYY-MM-DD 형식 문자열로 변환 (시간 제거)
  const formattedToday = today.toISOString().split('T')[0];
  const formattedFutureDate = futureDate.toISOString().split('T')[0];

  // 마감일(deadline)이 오늘~미래날짜 사이에 있는 Posts 조회 (유저 정보 포함)
  const query = supabase
    .from('Posts')
    .select(
      `
      *,
      user:Users!Posts_user_id_fkey (
        nickname,
        email,
        profile_image_url
      )
    `
    )
    .gte('deadline', formattedToday)
    .lte('deadline', formattedFutureDate)
    .order('deadline', { ascending: true });

  // category 필터가 존재할 경우 쿼리에 추가
  if (category) {
    query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  // Supabase join 결과로 인해 user가 배열일 수 있어 단일 객체로 정제
  const formatted = (data ?? []).map((post) => {
    const user = Array.isArray(post.user)
      ? (post.user[0] as PostWithUser['user'])
      : (post.user as PostWithUser['user']);

    return {
      ...(post as Omit<PostWithUser, 'user'>),
      user,
    };
  });

  return formatted;
};

// 관심 게시글 및 관심 IT행사 조회]
export const fetchLikedPosts = async (userId: string): Promise<(PostWithUser | ITEvent)[]> => {
  // 일반 게시글 관심 목록 조회
  const { data: interestsData, error: interestsError } = await supabase
    .from('Interests')
    .select('post_id, category')
    .eq('user_id', userId);

  if (interestsError) {
    console.error('내 관심 글 정보 불러오는 중 오류 발생:', interestsError);
    return [];
  }

  // IT 행사 관심 목록 조회
  const { data: itInterestsData, error: itInterestsError } = await supabase
    .from('IT_Interests')
    .select('event_id')
    .eq('user_id', userId);

  if (itInterestsError) {
    console.error('내 관심 글 IT 행사 정보 불러오는 중 오류 발생:', itInterestsError);
    return [];
  }

  const postIds = interestsData.map((interest) => interest.post_id);
  const eventIds = itInterestsData.map((interest) => interest.event_id);

  // 관심 게시글 상세 조회
  const { data: postsData, error: postsError } = await supabase
    .from('Posts')
    .select(
      `
      *,
      user:Users!Posts_user_id_fkey (
        nickname,
        email,
        profile_image_url
      )
    `,
    )
    .in('post_id', postIds);

  if (postsError) {
    console.error('포스트 불러오는 중 오류 발생:', postsError);
    return [];
  }

  const { data: eventsData, error: eventsError } = await supabase
    .from('IT_Events')
    .select('*')
    .in('event_id', eventIds);

  if (eventsError) {
    console.error('IT 행사 정보 불러오는 중 오류 발생:', eventsError);
    return [];
  }

  return [...postsData, ...eventsData] as (PostWithUser | ITEvent)[];
};

// IT 행사 마감일 필터링 조회
export const fetchEventsPostsWithDeadLine = async (
  days: number,
  category?: string | null,
): Promise<Tables<'IT_Events'>[]> => {
  const today = new Date(); // 🔹 오늘 날짜 기준 생성

  // 오늘을 기준으로 마감일까지 남은 날짜를 더한 날짜 계산
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  // ISO 포맷 문자열에서 날짜만 추출 (YYYY-MM-DD)
  const formattedToday = today.toISOString().split('T')[0];
  const formattedFutureDate = futureDate.toISOString().split('T')[0];

  // IT_Events 테이블에서 신청 마감일이 오늘 ~ 지정일 사이인 항목만 조회
  const query = supabase
    .from('IT_Events')
    .select('*')
    .gte('apply_done', formattedToday)
    .lte('apply_done', formattedFutureDate)
    .order('apply_start', { ascending: false });

  if (category) {
    query.eq('category', category);
  }
  const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Tables<'IT_Events'>[];
};

// IT 행사 목록 조회
export const fetchEventsPosts = async (
  page: number,
  category?: string,
  options: FetchEventsPostsOptions = {},
): Promise<Tables<'IT_Events'>[]> => {
  const postsPerPage = 10; // 한 페이지에 보여줄 IT 행사 개수
  const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 "YYYY-MM-DD" 형식으로 포맷
  const start = (page - 1) * postsPerPage; // 페이지네이션을 위한 시작 인덱스 계산

  let query = supabase.from('IT_Events').select('*').gte('date_done', today); // IT_Events 테이블에서 오늘 이후에 종료되는 행사만 조회

  // 카테고리 필터가 존재할 경우 조건 추가
  if (category && category !== '') {
    query = query.eq('category', category);
  }

  // 정렬 조건이 주어진 경우 정렬 기준 설정
  if (options.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending });
  }

  // 페이지 범위 설정 (예: 0~4, 5~9)
  query.range(start, start + postsPerPage - 1);
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data as Tables<'IT_Events'>[];
};
