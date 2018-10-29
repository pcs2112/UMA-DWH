import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector,
  createFetchingErrorSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';

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
