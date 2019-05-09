import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';
import { actionTypes as collegeScorecardActionTypes } from '../collegeScorecard/actions';
import { actionTypes as groupsActionTypes } from '../collegeScorecardGroups/actions';

// Initial state
const initialState = Object.assign({
  current: undefined
}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

/**
 * College scorecard reports reducer.
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
      return itemListReducer(state, action);
    case actionTypes.CREATE_SUCCESS: {
      const { response } = action;
      const current = { ...response };
      const newState = {
        ...state,
        data: [...(state.data || [])],
        dataLoaded: true
      };
      newState.data.push(current);
      newState.current = current;
      return newState;
    }
    case actionTypes.UPDATE_SUCCESS: {
      const { response } = action;
      const current = { ...response };
      const idx = state.data.findIndex(item => item.id === current.id);
      const newState = {
        ...state,
        data: [...state.data]
      };
      newState[idx] = current;
      newState.current = current;
      return newState;
    }
    case actionTypes.FETCH_REPORT_SUCCESS: {
      const { data } = state;
      const { currentId, response } = action;
      const idx = data.findIndex(item => item.id === currentId);

      if (idx < 0) {
        return state;
      }

      const newData = [...data];
      const current = { ...response };
      newData[idx] = current;

      return {
        ...state,
        data: newData,
        current
      };
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.RESET_REPORT:
      return {
        ...state,
        current: undefined
      };
    case actionTypes.SAVE_REPORT_TABLE_SUCCESS: {
      const { response, tableSchema, tableName } = action;
      return {
        ...state,
        newTableSchema: tableSchema,
        newTableName: tableName,
        newReportRowCount: response.row_count
      };
    }
    case collegeScorecardActionTypes.SELECT:
    case collegeScorecardActionTypes.UNSELECT:
    case collegeScorecardActionTypes.SELECT_ALL:
    case collegeScorecardActionTypes.UNSELECT_ALL:
    case collegeScorecardActionTypes.REORDER:
    case groupsActionTypes.SELECT:
    case groupsActionTypes.UNSELECT:
    case groupsActionTypes.SELECT_ALL:
    case groupsActionTypes.UNSELECT_ALL: {
      const { current } = state;
      if (!current || current.hasChanged) {
        return state;
      }

      return {
        ...state,
        current: {
          ...current,
          hasChanged: true
        }
      };
    }
    default:
      return state;
  }
};
