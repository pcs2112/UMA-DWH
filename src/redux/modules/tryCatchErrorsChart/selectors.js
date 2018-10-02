import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('tryCatchErrorsChart', 'dataLoaded', 'data');

/**
 * Returns the try catch errors chart data from the state.
 */
export const getTryCatchErrorsChartData = createGetItemsSelector(_getData);
