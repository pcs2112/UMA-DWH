import { SHOW_MODAL, HIDE_MODAL } from './actions';

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        modalName: action.modalName
      };
    case HIDE_MODAL:
      return {
        ...state,
        modalName: null
      };
    default:
      return state;
  }
};
