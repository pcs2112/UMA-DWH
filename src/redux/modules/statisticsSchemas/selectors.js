import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('statisticsSchemas');

/**
 * Returns the DWH statistics schemas from the state.
 */
export const getSchemas = createGetItemsSelector(_getData);
