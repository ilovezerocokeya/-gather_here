// 멀티 셀렉트 옵션 항목 형식 정의
export interface Option {
  value: string;
  label: string;
}

// 게시글 작성 폼에서 사용하는 전체 상태 구조 정의
export interface PostFormState {
  title: string;              
  category: string;           
  place: string;              
  location: string;           
  duration: string;           
  totalMembers: string;       
  personalLink: string;       
  targetPosition: Option[];   
  recruitmentCount: string;   
  techStack: Option[];        
  deadline: string;           
  content: string;            
}

// PostForm 상태 초기값 정의
export const initialFormState: PostFormState = {
  title: '',
  category: '',
  place: '',
  location: '',
  duration: '',
  totalMembers: '',
  personalLink: '',
  targetPosition: [],
  recruitmentCount: '',
  techStack: [],
  deadline: '',
  content: '',
};

// PostForm 상태를 제어하기 위한 액션 타입 정의 
export type PostFormAction =
  | { type: 'SET_FIELD'; key: keyof PostFormState; value: string } // 단일 필드 문자열 업데이트
  | { type: 'SET_MULTISELECT'; key: 'targetPosition' | 'techStack'; value: Option[] } // 멀티 셀렉트 필드 업데이트
  | { type: 'RESET_FORM' } // 전체 폼 초기화
  | { type: 'SET_ALL'; value: Partial<PostFormState> }; // 여러 필드 일괄 설정