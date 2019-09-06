import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('telecomSkills', 'dataLoaded', 'data');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('telecomSkills', 'fetchingError', 'payload');

/**
 * Returns the skills data.
 */
export const getData = createGetItemsSelector(_getData);
