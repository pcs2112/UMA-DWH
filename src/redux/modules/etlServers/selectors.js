import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('etlServers');

/**
 * Returns the ETL servers from the state.
 */
export const getServers = createGetItemsSelector(_getData);
