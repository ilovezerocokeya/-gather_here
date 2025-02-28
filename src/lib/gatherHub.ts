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
  description: string;
  answer1: string;
  answer2: string;
  answer3: string;
  liked: boolean;
  toggleLike: (userId: string, currentUserId: string) => void;
  tech_stacks: string[];
}

// CardUI에서만 필요한 추가 속성
export interface CardUIProps {
  nickname: string;
  job_title: string;
  experience: string;
  description: string;
  background_image_url: string;
  profile_image_url: string;
  blog: string;
  first_link_type?: string;
  first_link?: string;
  second_link_type?: string;
  second_link?: string;
  liked: boolean;
  handleToggleLike: () => void;
  secureImageUrl: (url: string) => string;
  onOpenModal: () => void;
  onOpenProfile: () => void;
}

// CardModal 인터페이스
export interface CardModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  nickname: string;
  job_title: string;
  experience: string;
  description: string;
  profile_image_url: string;
  background_image_url: string;
  blog: string;
  liked: boolean;
  answer1: string;
  answer2: string;
  answer3: string;
  first_link_type?: string;
  first_link?: string;
  second_link_type?: string;
  second_link?: string;
  selectedTechStacks: { id: string; name: string; image: string }[];
  handleToggleLike?: () => void;
  secureImageUrl: (url: string) => string;
}

export interface ProfileExtendProps {
  isOpen: boolean;
  closeModal: () => void;
  profileImageUrl: string;
  nickname: string;
  secureImageUrl: (url: string) => string;
}

// useMemberData에서 사용하는 훅 반환 타입
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

// JobDirectory에서 사용하는 Props 타입
export interface JobDirectoryProps {
  setFilteredJob: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

// JobFilter에서 사용하는 Props 타입
export interface JobFilterProps {
  selectedJob: string;
  handleSelectJob: (jobValue: string) => void;
  jobCategories: { name: string; value: string }[];
}

// HubRegister에서 사용하는 Props 타입
export interface HubRegisterProps {
  isAuthenticated: boolean;
  isHubRegistered: boolean;
  openLoginModal: () => void;
}

// LoginModal에서 사용하는 Props 타입
export interface LoginModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}