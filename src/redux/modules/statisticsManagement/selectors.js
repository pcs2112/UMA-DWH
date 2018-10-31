import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector,
  createFetchingErrorSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { isEmpty } from 'javascript-utils/lib/utils';

const _getData = createDataSelector('statisticsManagement', 'dataLoaded', 'data');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('statisticsManagement', 'fetchingError', 'payload');

/**
 * Returns the DWH statistics management from the state.
 */
export const getStatisticsManagement = createGetItemsSelector(_getData);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createGetPropertySelector('statisticsManagement', 'selected');

/**
 * Selector to get the total count of selected statistics management items.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => Object.keys(selected).length
);

/**
 * Selector to get the queued items selected.
 */
export const getQueuedSelected = createSelector(
  [getSelected],
  (selected) => {
    const keys = Object.keys(selected);
    const queuedSelected = [];

    keys.forEach((key) => {
      const item = selected[key];
      if (!isEmpty(item.queued_dttm)) {
        queuedSelected.push({
          id: item.schema_table,
          database: item.database,
          schema: item.schema,
          table: item.table
        });
      }
    });

    return queuedSelected;
  }
);

/**
 * Selector to get dequeued items selected.
 */
export const getDequeuedSelected = createSelector(
  [getSelected],
  (selected) => {
    const keys = Object.keys(selected);
    const dequeuedSelected = [];

    keys.forEach((key) => {
      const item = selected[key];
      if (isEmpty(item.queued_dttm)) {
        dequeuedSelected.push({
          id: item.schema_table,
          database: item.database,
          schema: item.schema,
          table: item.table
        });
      }
    });

    return dequeuedSelected;
  }
);
