import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('etlControlManager');

/**
 * Returns the ETL control manager data from the state.
 */
export const getControlManager = createGetItemsSelector(_getData);
