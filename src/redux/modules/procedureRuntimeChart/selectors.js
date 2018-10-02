import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('procedureRuntimeChart', 'dataLoaded', 'data');

/**
 * Returns the ETL procedure runtime chart data from the state.
 */
export const getProcedureRuntimeChartData = createGetItemsSelector(_getData);
