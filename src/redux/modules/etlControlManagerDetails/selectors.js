import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('etlControlManagerDetails', 'dataLoaded', 'data');

/**
 * Returns the ETL control manager details data from the state.
 */
export const getControlManagerDetailsData = createGetItemsSelector(_getData);
