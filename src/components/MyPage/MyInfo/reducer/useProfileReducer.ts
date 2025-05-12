

// 상태 정의
export interface UserProfileState {
  isChanged: boolean;
  isSaveModalOpen: boolean;
  isCancelModalOpen: boolean;
  nickname: string; 
  updatedImageUrl: string | null;
  localInitialData: {
    email: string;
    nickname: string;
    jobTitle: string;
    experience: string;
    profileImageUrl: string;
  }; 
}

// 액션 타입 정의
export type UserProfileAction =
  | { type: "SET_CHANGED"; payload: boolean }
  | { type: "TOGGLE_CANCEL_MODAL"; payload: boolean } 
  | { type: "TOGGLE_SAVE_MODAL"; payload: boolean }
  | { type: "SET_NICKNAME"; payload: string }
  | { type: "SET_IMAGE_URL"; payload: string | null }
  | { type: "UPDATE_INITIAL_DATA"; payload: UserProfileState["localInitialData"] };

// 초기 상태 생성 함수
export const createInitialState = (
  initialData: UserProfileState["localInitialData"]
): UserProfileState => ({
  isChanged: false,
  isSaveModalOpen: false,
  isCancelModalOpen: false,
  nickname: initialData.nickname,
  updatedImageUrl: null,
  localInitialData: initialData,
});

export function userProfileReducer(
  state: UserProfileState,
  action: UserProfileAction
): UserProfileState {
  switch (action.type) {
    // 변경 여부 설정 (true/false)
    case "SET_CHANGED":
      return { ...state, isChanged: action.payload };

      // 취소 모달 표시 여부 토글
    case "TOGGLE_CANCEL_MODAL":
      return { ...state, isCancelModalOpen: action.payload };

      // 저장 완료 모달 표시 여부 토글
    case "TOGGLE_SAVE_MODAL":
      return { ...state, isSaveModalOpen: action.payload };

      // 닉네임 입력 상태 갱신
    case "SET_NICKNAME":
      return { ...state, nickname: action.payload };

      // 새로 업로드된 이미지 URL 상태 갱신
    case "SET_IMAGE_URL":
      return { ...state, updatedImageUrl: action.payload };

      // 초기 상태(서버와 동기화된 최신 데이터) 갱신
    case "UPDATE_INITIAL_DATA":
      return { ...state, localInitialData: action.payload };

    default:
      return state;
  }
}