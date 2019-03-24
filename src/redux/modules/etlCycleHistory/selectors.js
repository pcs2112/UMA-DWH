import { createSelector } from 'reselect';
import { objectHasOwnProperty, isEmpty } from 'javascript-utils/lib/utils';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createGetCurrentCycleGroupStartDttm } from '../../../helpers/selectors';
import { sortMultiple } from '../../../helpers/utils';
import { getControlManagerDetailsData } from '../etlControlManagerDetails/selectors';
import { getSelected as getSelectedDataMarts } from '../etlCurrentStatus/selectors';
import {
  LIST_ITEM_KEY_NAME, FILTERS_STATE_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

/**
 * Returns the history data from the state.
 * @param {Object} state
 */
const _getData = createDataSelector('etlCycleHistory', 'dataLoaded', 'data');

/**
 * Return the selected order from the state.
 */
const _getSelectedOrder = createGetPropertySelector('etlCycleHistory', SELECTED_ORDER_STATE_KEY_NAME);

/**
 * Returns the ETL history from the state.
 */
export const getHistory = createGetItemsSelector(_getData);

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlCycleHistory', 'fetchingError', 'payload');

/**
 * Returns the cycle history list filters.
 */
export const getFilters = createGetPropertySelector('etlCycleHistory', FILTERS_STATE_KEY_NAME);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createGetPropertySelector('etlCycleHistory', SELECTED_STATE_KEY_NAME);

/**
 * Returns the start cycle group.
 */
export const getStartCycleGroup = createGetPropertySelector('etlCycleHistory', 'startCycleGroup');

/**
 * Returns the current cycle group.
 */
export const getCurrentCycleGroup = createGetPropertySelector('etlCycleHistory', 'currentCycleGroup');

/**
 * Selector to get the total count of procedures and data marts selected.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => Object.keys(selected).length
);

/**
 * Selector to get the last procedure selected.
 */
export const getLastSelected = createSelector(
  [_getSelectedOrder, getSelected],
  (selectedOrder, selected) => {
    if (selectedOrder.length < 1) {
      return undefined;
    }

    const selectedOrderReversed = selectedOrder.reverse();
    const selectedProcedureName = selectedOrderReversed
      .find(procedureName => objectHasOwnProperty(selected, procedureName)
        && objectHasOwnProperty(selected[procedureName], LIST_ITEM_KEY_NAME));

    if (!selectedProcedureName) {
      return undefined;
    }

    return selected[selectedProcedureName];
  }
);

/**
 * Returns the ETL history by cycle group from the state.
 */
export const getHistoryByCycleGroup = createSelector(
  [
    _getData,
    getCurrentCycleGroup,
    getSelectedDataMarts,
    getControlManagerDetailsData,
    getFilters
  ],
  (data, cycleGroup, dataMarts, controlManager, filters) => {
    if (data.length < 1 || controlManager.length < 1) {
      return [];
    }

    // Get the data mart selected count
    const dataMartsSelectedCount = Object.keys(dataMarts).length;

    // Get the map of procedure names to item index
    const map = {};
    const dataByCycleGroup = [];
    let cycleGroupItemIndex = 0;
    data.forEach((item) => {
      if (item.cycle_group === cycleGroup) {
        const key = item.calling_proc.toLowerCase();
        map[key] = cycleGroupItemIndex;

        dataByCycleGroup.push(item);
        cycleGroupItemIndex++;
      }
    });

    // Get the empty result for missing history items
    const keys = Object.keys(data[0]);
    const defaultMissingItem = {};
    keys.forEach((key) => {
      defaultMissingItem[key] = '';
    });

    // Put together the result set
    let result = [];
    controlManager.forEach((item, index) => {
      if (dataMartsSelectedCount < 1 || objectHasOwnProperty(dataMarts, item.data_mart_name)) {
        const key = item.procedure_name.toLowerCase();
        const historyItemIndex = objectHasOwnProperty(map, key) ? map[key] : -1;
        if (historyItemIndex > -1) {
          result.push(dataByCycleGroup[historyItemIndex]);
        } else {
          const missingItem = { ...defaultMissingItem };
          missingItem.id = `${item.procedure_name}_${cycleGroup}`;
          missingItem.calling_proc = item.procedure_name;
          missingItem.cycle_group = cycleGroup;
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
          result.push(missingItem);
        }
      }
    });

    if (objectHasOwnProperty(filters, 'active') && filters.active === 0) {
      result = result.filter(res => res.active === 0);
    }

    if (objectHasOwnProperty(filters, 'query') && !isEmpty(filters.query) && filters.query.length >= 3) {
      const queryNormalized = filters.query.toLowerCase();
      result = result.filter((res) => {
        const normalizedValue = `${res.target_schema_name}.${res.target_table_name}`.toLowerCase();
        return normalizedValue.indexOf(queryNormalized) > -1;
      });
    }

    result.sort(sortMultiple(['color_status', 'original_index']));

    return result;
  }
);

/**
 * Returns the current cycle group's start dttm.
 */
export const getCurrentCycleGroupStartDttm = createGetCurrentCycleGroupStartDttm(_getData, 'start_dttm');

/**
 * Returns the interval duration from the state.
 */
export const getIntervalDuration = createGetPropertySelector('etlCycleHistory', 'intervalDuration');

/**
 * Returns the cycle date.
 */
export const getCycleDate = createSelector(
  [getFilters],
  filters => filters.cycleDate
);
