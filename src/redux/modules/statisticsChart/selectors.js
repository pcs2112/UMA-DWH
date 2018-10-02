import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('statisticsChart', 'dataLoaded', 'data');

/**
 * Returns the DWH statistics chart data from the state.
 */
export const getStatisticsChartData = createGetItemsSelector(_getData);
