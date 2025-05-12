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
  imageVersion?: number;
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
  onOpenProfile?: () => void;
  imageVersion?: number;
  priority?: boolean;
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
  imageVersion?: number;
}

export interface ProfileExtendProps {
  isOpen: boolean;
  closeModal: () => void;
  profileImageUrl: string;
  nickname: string;
  secureImageUrl: (url: string) => string;
  imageVersion?: number;
}

// useMemberData에서 사용하는 훅 반환 타입
export interface UseMemberDataReturn {
  filteredMembers: MemberCardProps[];
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => Promise<unknown>;
  refetch: () => Promise<unknown>;
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

// fetchMember API 응답 데이터 타입 정의
export interface FetchMembersResponse {
  members: MemberCardProps[]; // 가져온 멤버 목록
  nextPage?: number; // 다음 페이지 번호
}

// 멤버 타입 정의
export interface MemberType {
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
  imageVersion?: number;
}

export interface JobCategoryOption {
  name: string;
  value: string;
  hoverClass: string;
}

export const jobCategories: JobCategoryOption[] = [
  { name: "전체보기", value: "all", hoverClass: "hover:bg-primary hover:text-black" },
  { name: "프론트엔드", value: "프론트엔드", hoverClass: "hover:bg-primaryStrong hover:text-black" },
  { name: "백엔드", value: "백엔드", hoverClass: "hover:bg-accentOrange hover:text-black" },
  { name: "IOS", value: "IOS", hoverClass: "hover:bg-accentMaya hover:text-black" },
  { name: "안드로이드", value: "안드로이드", hoverClass: "hover:bg-accentPurple hover:text-black" },
  { name: "데브옵스", value: "데브옵스", hoverClass: "hover:bg-accentRed hover:text-black" },
  { name: "디자인", value: "디자인", hoverClass: "hover:bg-accentMint hover:text-black" },
  { name: "PM", value: "PM", hoverClass: "hover:bg-accentColumbia hover:text-black" },
  { name: "기획", value: "기획", hoverClass: "hover:bg-accentPink hover:text-black" },
  { name: "마케팅", value: "마케팅", hoverClass: "hover:bg-accentYellow hover:text-black" },
];