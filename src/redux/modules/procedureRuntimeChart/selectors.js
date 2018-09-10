import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('procedureRuntimeChart');

/**
 * Returns the ETL procedure runtime chart data from the state.
 */
export const getProcedureRuntimeChartData = createGetItemsSelector(_getData);
