import { PostFormState, PostFormAction, initialFormState } from '../postFormTypes';

export function postFormReducer(
  state: PostFormState,
  action: PostFormAction
): PostFormState {
  switch (action.type) {
    // 단일 문자열 필드 업데이트
    case 'SET_FIELD':
      return {
        ...state,
        [action.key]: action.value,
      };

    // 멀티 셀렉트 필드 
    case 'SET_MULTISELECT':
      return {
        ...state,
        [action.key]: action.value,
      };

    // 여러 필드를 한꺼번에 덮어쓰기
    case 'SET_ALL':
      return {
        ...state,
        ...action.value,
      };

    // 전체 폼 상태 초기화
    case 'RESET_FORM':
      return initialFormState;

    // 정의되지 않은 액션은 현재 상태 유지
    default:
      return state;
  }
}