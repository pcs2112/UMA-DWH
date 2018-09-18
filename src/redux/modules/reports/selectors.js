import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('reports');

/**
 * Returns the ETL reports from the state.
 */
export const getReports = createGetItemsSelector(_getData);
