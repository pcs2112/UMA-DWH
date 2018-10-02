import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('etlServers', 'dataLoaded', 'data');

/**
 * Returns the ETL servers from the state.
 */
export const getServers = createGetItemsSelector(_getData);
