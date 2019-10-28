import { replaceObjByValue } from 'javascript-utils/lib/array';
import itemListReducerFor, { initialState as itemListInitialState } from '../../../reducers/itemListReducerFor';
import crudListReducerFor, { initialState as crudListInitialState } from '../../../reducers/crudListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  isScheduleFetching: false,
  scheduleLoaded: false,
  schedule: false,
  scheduleFetchingError: false
}, itemListInitialState, crudListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const crudListReducer = crudListReducerFor(actionTypes);

/**
 * Cubes reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
    case actionTypes.FETCH_SUCCESS:
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.CREATE_SUCCESS:
    case actionTypes.UPDATE_SUCCESS:
    case actionTypes.UPDATING_START:
    case actionTypes.UPDATING_END:
      return crudListReducer(state, action);
    case actionTypes.FETCH_SCHEDULE_BEGIN:
      return {
        ...state,
        isScheduleFetching: true
      };
    case actionTypes.FETCH_SCHEDULE_FAIL:
      return {
        ...state,
        isScheduleFetching: false,
        scheduleLoaded: false,
        scheduleFetchingError: action.error
      };
    case actionTypes.FETCH_SCHEDULE_SUCCESS: {
      const { data, updating } = state;
      const cube = data.find((item) => item.id === updating);
      return {
        ...state,
        isScheduleFetching: false,
        scheduleLoaded: true,
        schedule: action.response,
        scheduleFetchingError: false,
        data: replaceObjByValue(state.data, { ...cube }, cube.id)
      };
    }
    default:
      return state;
  }
};
