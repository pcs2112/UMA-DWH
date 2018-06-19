import { replaceObjByValue } from '../../helpers/array';

export const initialState = {
  data: false
};

/**
 * Reusable factory reducer to handle CRUD operations in list items.
 *
 * @param {Object} actionTypes
 * @returns {Function}
 */
const crudListReducerFor = ({
  CREATE_SUCCESS, UPDATE_SUCCESS, UPDATING_START, UPDATING_END
}) => (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SUCCESS: {
      const newData = state.data.slice();
      newData.push({ ...action.response });
      return {
        ...state,
        data: newData
      };
    }
    case UPDATE_SUCCESS:
      return {
        ...state,
        data: replaceObjByValue(state.data, { ...action.response }, action.id)
      };
    case UPDATING_START:
      return {
        ...state,
        updating: action.id
      };
    case UPDATING_END: {
      const newState = { ...state };
      delete newState.updating;
      return newState;
    }
    default:
      return state;
  }
};

export default crudListReducerFor;
