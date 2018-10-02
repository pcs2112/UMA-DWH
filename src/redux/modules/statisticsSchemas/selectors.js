import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('statisticsSchemas', 'dataLoaded', 'data');

/**
 * Returns the DWH statistics schemas from the state.
 */
export const getSchemas = createGetItemsSelector(_getData);
