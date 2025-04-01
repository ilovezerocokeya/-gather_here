// 사용자 데이터 기본 타입 정의
export interface UserData {
    user_id: string;
    nickname: string;
    job_title: string;
    experience: string;
    description: string;
    profile_image_url: string;
    blog: string;
    hubCard?: boolean;
    background_image_url?: string;
    answer1?: string;
    answer2?: string;
    answer3?: string;
    first_link_type?: string;
    first_link?: string;
    second_link_type?: string;
    second_link?: string;
    tech_stacks?: string[];
  }
  
  // 기본값 제공 (null 방지)
  export const defaultUserData: UserData = {
    user_id: "",
    nickname: "",
    job_title: "",
    experience: "",
    description: "",
    profile_image_url: "",
    blog: "",
    hubCard: false,
    background_image_url: "",
    answer1: "",
    answer2: "",
    answer3: "",
    first_link_type: "",
    first_link: "",
    second_link_type: "",
    second_link: "",
    tech_stacks: [],
  };