import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('reportRuntimeChart', 'dataLoaded', 'data');

/**
 * Returns the ETL report runtime chart data from the state.
 */
export const getReportRuntimeChartData = createGetItemsSelector(_getData);
