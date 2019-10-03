import {
  createDataSelector,
  createFetchingErrorSelector, createGetItemByIdSelector,
  createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createSelector } from 'reselect/lib/index';

const _getData = createDataSelector('dataLakeEntries', 'dataLoaded', 'data');

/**
 * Returns the updating entry id.
 */
const _getUpdatingEntryId = createGetPropertySelector('dataLakeEntries', 'updating');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('dataLakeEntries', 'fetchingError', 'payload');

/**
 * Returns the entries data.
 */
export const getData = createGetItemsSelector(_getData);

/**
 * Returns the current updating entry.
 */
export const getUpdatingEntry = createGetItemByIdSelector(_getData, _getUpdatingEntryId);

/**
 * Gets the initial form values for the updating entry.
 */
export const getUpdatingEntryInitialValues = createSelector(
  [getUpdatingEntry],
  (entry) => {
    if (!entry) {
      return {};
    }

    return {
      entry_id: entry.id
    };
  }
);
