import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('reports', 'dataLoaded', 'data');

/**
 * Returns the ETL reports from the state.
 */
export const getReports = createGetItemsSelector(_getData);
