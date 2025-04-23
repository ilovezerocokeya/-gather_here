import { PostFormState, PostFormAction, initialFormState } from '../postFormTypes';

export function postFormReducer(
  state: PostFormState,
  action: PostFormAction
): PostFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.key]: action.value,
      };
    case 'SET_MULTISELECT':
      return {
        ...state,
        [action.key]: action.value,
      };
    case 'SET_ALL':
      return {
        ...state,
        ...action.value,
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
}