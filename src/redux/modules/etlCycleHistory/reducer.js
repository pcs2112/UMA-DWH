import { isEmpty, objectHasOwnProperty } from 'javascript-utils/lib/utils';
import { sortMultiple } from '../../../helpers/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { getInitialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';
import {
  LIST_ITEM_KEY_NAME, FILTERS_STATE_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

const defaultFilters = {
  query: '',
  active: 1,
  cycleDate: ''
};

// Initial state
const initialState = Object.assign(
  {
    allData: false,
    startCycleGroup: 0,
    currentCycleGroup: 0,
    intervalDuration: 15000
  },
  filtersInitialState(defaultFilters, FILTERS_STATE_KEY_NAME),
  itemListInitialState,
  itemListSelectInitialState(SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME)
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(
  actionTypes, LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, FILTERS_STATE_KEY_NAME);

// Updates the item which new properties after a successful fetch
const filterData = (state, action) => {
  const { filters } = state;
  let { allData } = state;
  const {
    startCycleGroup, currentCycleGroup, dataMarts, controlManager
  } = action;

  const newState = {
    ...state,
    dataLoaded: true,
    isFetching: false,
    fetchingError: initialState.fetchingError,
    startCycleGroup,
    currentCycleGroup
  };

  if (action.response) {
    allData = action.response;
    allData.forEach((item, index) => {
      if (item.err_num > 0) {
        item.color_status = -2;
      } else if (item.try_catch_err_id > 0) {
        item.color_status = -1;
      } else if (item.table_status === 'RUNNING') {
        item.color_status = 1;
      } else if (item.table_status === 'NOT STARTED') {
        item.color_status = 2;
      } else {
        item.color_status = 3;
      }

      item.original_index = index;
    });

    newState.allData = allData;
  }

  // Get the data mart selected count
  const dataMartsSelectedCount = Object.keys(dataMarts).length;

  // Get the map of procedure names to item index
  const map = {};
  const dataByCycleGroup = [];
  let cycleGroupItemIndex = 0;
  allData.forEach((item) => {
    if (item.cycle_group === currentCycleGroup) {
      const key = item.calling_proc.toLowerCase();
      map[key] = cycleGroupItemIndex;

      dataByCycleGroup.push(item);
      cycleGroupItemIndex++;
    }
  });

  // Get the empty result for missing history items
  const keys = Object.keys(allData[0]);
  const defaultMissingItem = {};
  keys.forEach((key) => {
    defaultMissingItem[key] = '';
  });

  // Put together the new data
  let newData = [];
  controlManager.forEach((item, index) => {
    if (dataMartsSelectedCount < 1 || objectHasOwnProperty(dataMarts, item.data_mart_name)) {
      const key = item.procedure_name.toLowerCase();
      const historyItemIndex = objectHasOwnProperty(map, key) ? map[key] : -1;
      if (historyItemIndex > -1) {
        newData.push(dataByCycleGroup[historyItemIndex]);
      } else {
        const missingItem = { ...defaultMissingItem };
        missingItem.id = `${item.procedure_name}_${currentCycleGroup}`;
        missingItem.calling_proc = item.procedure_name;
        missingItem.cycle_group = currentCycleGroup;
        missingItem.data_mart_name = item.data_mart_name;
        missingItem.table_status = 'NOT STARTED';
        missingItem.color_status = 2;
        missingItem.source_server_name = item.source_server_name;
        missingItem.source_db_name = item.source_db_name;
        missingItem.source_table_name = item.source_table_name;
        missingItem.target_table_name = item.target_table_name;
        missingItem.source_schema_name = item.source_schema_name;
        missingItem.target_schema_name = item.target_schema_name;
        missingItem.active = 1;
        missingItem.original_index = index;
        newData.push(missingItem);
      }
    }
  });

  if (objectHasOwnProperty(filters, 'active') && filters.active === 0) {
    newData = newData.filter(item => item.active === 0);
  }

  if (objectHasOwnProperty(filters, 'query') && !isEmpty(filters.query) && filters.query.length >= 3) {
    const queryNormalized = filters.query.toLowerCase();
    newData = newData.filter((item) => {
      const normalizedValue = `${item.target_schema_name}.${item.target_table_name}`.toLowerCase();
      return normalizedValue.indexOf(queryNormalized) > -1;
    });
  }

  newData.sort(sortMultiple(['color_status', 'original_index']));

  newState.data = newData;

  return newState;
};

/**
 * ETL history reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
      return itemListReducer(state, action);
    case actionTypes.FETCH_SUCCESS: {
      return filterData(setFilters(state, action), action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.CLEAR_FETCH_FAIL:
      return {
        ...state,
        fetchingError: initialState.fetchingError
      };
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    case actionTypes.SELECT:
    case actionTypes.UNSELECT:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    case actionTypes.SET_INTERVAL_DURATION:
      return {
        ...state,
        intervalDuration: action.intervalDuration
      };
    default:
      return state;
  }
};
