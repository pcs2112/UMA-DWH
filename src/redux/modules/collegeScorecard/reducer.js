import { arrayUnique } from 'javascript-utils/lib/array';
import { objectHasOwnProperty } from 'javascript-utils/src/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { selectAllReducer, unselectAllReducer, initialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import itemListFiltersReducerFor from '../../reducers/itemListFiltersReducerFor';
import { actionTypes as groupsActionTypes } from '../collegeScorecardGroups/actions';

import { actionTypes } from './actions';

const defaultFilters = {
  fileName: '',
  populated: ''
};

const itemKeyName = 'dictionary_entry_id';

// Initial state
const initialState = Object.assign({}, defaultFilters, itemListInitialState, itemListSelectInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(actionTypes, itemKeyName);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters);

/**
 * College scorecard reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
    case actionTypes.FETCH_SUCCESS: {
      const newState = itemListReducer(state, action);
      return setFilters(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SELECT:
    case actionTypes.SELECT_ALL:
    case actionTypes.UNSELECT:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    case groupsActionTypes.SELECT: {
      const group = action.data;
      const columns = group.group_entry_id_list.trim().split(/[\s,]+/);
      if (columns.length < 1) {
        return state;
      }

      const columnLookUp = {};
      const { data, selected, selectedOrder } = state;
      const newSelected = { ...selected };
      const newSelectedOrder = [...selectedOrder];

      data.forEach((item, i) => {
        columnLookUp[item[itemKeyName]] = i;
      });

      columns.forEach((column) => {
        const item = data[columnLookUp[column]];
        if (item) {
          newSelected[item[itemKeyName]] = item;
          newSelectedOrder.push(item[itemKeyName]);
        }
      });

      return {
        ...state,
        selected: newSelected,
        selectedOrder: arrayUnique(newSelectedOrder)
      };
    }
    case groupsActionTypes.UNSELECT: {
      const { selected, selectedOrder } = state;
      const { data } = action;
      const columns = data.group_entry_id_list.trim().split(/[\s,]+/);

      const newSeleted = {
        ...selected
      };

      columns.forEach((column) => {
        delete (newSeleted[column]);
      });

      const newSelectedOrder = [];
      selectedOrder.forEach((item) => {
        if (objectHasOwnProperty(newSeleted, item)) {
          newSelectedOrder.push(item);
        }
      });

      return {
        ...state,
        selected: newSeleted,
        selectedOrder: newSelectedOrder
      };
    }
    case groupsActionTypes.SELECT_ALL:
      return selectAllReducer(itemKeyName, state);
    case groupsActionTypes.UNSELECT_ALL:
      return unselectAllReducer(state);
    default:
      return state;
  }
};
