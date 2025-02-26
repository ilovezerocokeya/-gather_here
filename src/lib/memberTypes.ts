import { Dispatch, SetStateAction } from "react";

// 멤버 카드 인터페이스
export interface MemberCardProps {
  user_id: string;
  nickname: string;
  job_title: string;
  experience: string;
  background_image_url: string;
  profile_image_url: string;
  blog: string;
  first_link_type?: string;
  first_link?: string;
  second_link_type?: string;
  second_link?: string;
  description?: string;
  answer1: string;
  answer2: string;
  answer3: string;
  liked: boolean;
  toggleLike: () => Promise<void>;
  tech_stacks?: string[];
}

// useMemberData.ts에서 사용하는 훅 반환 타입
export interface UseMemberDataReturn {
  filteredMembers: MemberCardProps[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  setFilteredJob: Dispatch<SetStateAction<string>>;
}

// GatherHubPageClient에서 사용하는 Props 타입
export interface GatherHubPageClientProps {
  initialData: {
    members: MemberCardProps[];
    nextPage: number | undefined;
  };
}

// MemberList 컴포넌트에서 사용하는 Props 타입
export interface MemberListProps {
  filteredMembers: MemberCardProps[];
}