import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('etlControlManager', 'dataLoaded', 'data');

/**
 * Returns the ETL control manager data from the state.
 */
export const getControlManager = createGetItemsSelector(_getData);
