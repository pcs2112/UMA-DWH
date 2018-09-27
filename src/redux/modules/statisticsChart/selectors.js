import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('statisticsChart');

/**
 * Returns the DWH statistics chart data from the state.
 */
export const getStatisticsChartData = createGetItemsSelector(_getData);
