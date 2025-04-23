export interface Option {
    value: string;
    label: string;
  }
  
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
  
  export type PostFormAction =
    | { type: 'SET_FIELD'; key: keyof PostFormState; value: string }
    | { type: 'SET_MULTISELECT'; key: 'targetPosition' | 'techStack'; value: Option[] }
    | { type: 'RESET_FORM' }
    | { type: 'SET_ALL'; value: Partial<PostFormState> };