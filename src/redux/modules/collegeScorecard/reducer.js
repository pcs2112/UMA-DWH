import { arrayUnique } from 'javascript-utils/lib/array';
import { objectHasOwnProperty } from 'javascript-utils/src/utils';
import { reorderList } from '../../../helpers/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { selectAllReducer, unselectAllReducer, initialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes as groupsActionTypes } from '../collegeScorecardGroups/actions';

import { actionTypes } from './actions';

const defaultFilters = {
  fileName: '',
  populated: '',
  query: ''
};

const itemKeyName = 'dictionary_entry_id';

// Initial state
const initialState = Object.assign({
  selectedManually: {

  }
}, filtersInitialState(defaultFilters), itemListInitialState, itemListSelectInitialState);

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
    case actionTypes.SELECT: {
      const newState = itemListSelectReducer(state, action);
      return {
        ...newState,
        selectedManually: {
          ...(newState.selectedManually || {}),
          [action.data[itemKeyName]]: action.data[itemKeyName]
        }
      };
    }
    case actionTypes.UNSELECT: {
      const newState = itemListSelectReducer(state, action);
      const newSelectedManually = {
        ...(newState.selectedManually || {})
      };
      delete (newSelectedManually[action.keyValue]);
      newState.selectedManually = newSelectedManually;
      return newState;
    }
    case actionTypes.SELECT_ALL:
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
      const { selected, selectedOrder, selectedManually } = state;
      const { data } = action;
      const columns = data.group_entry_id_list.trim().split(/[\s,]+/);

      const newSeleted = {
        ...selected
      };

      columns.forEach((column) => {
        if (!objectHasOwnProperty(selectedManually, column)) {
          delete (newSeleted[column]);
        }
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
    case actionTypes.REORDER: {
      const { selectedOrder } = state;
      const { startIndex, endIndex } = action;
      const newSelectedOrder = reorderList(selectedOrder, startIndex, endIndex);

      return {
        ...state,
        selectedOrder: newSelectedOrder
      };
    }
    case actionTypes.LOAD_SAVED_REPORT: {
      const { data } = state;
      const { report } = action;
      const idxLoopup = {};
      const newSelectedManually = {};
      const newSelectedOrder = [];
      const newSelected = {};

      data.forEach((item, i) => {
        idxLoopup[item.column_name] = i;
      });

      report.columns.forEach((col) => {
        const idx = idxLoopup[col];
        if (typeof idx !== 'undefined') {
          const column = data[idx];
          newSelectedManually[column[itemKeyName]] = column[itemKeyName];
          newSelectedOrder.push(column[itemKeyName]);
          newSelected[column[itemKeyName]] = column;
        }
      });

      return {
        ...state,
        selectedManually: newSelectedManually,
        selectedOrder: newSelectedOrder,
        selected: newSelected
      };
    }
    default:
      return state;
  }
};
