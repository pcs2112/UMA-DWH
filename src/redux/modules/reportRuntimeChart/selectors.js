import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('reportRuntimeChart');

/**
 * Returns the ETL report runtime chart data from the state.
 */
export const getReportRuntimeChartData = createGetItemsSelector(_getData);
