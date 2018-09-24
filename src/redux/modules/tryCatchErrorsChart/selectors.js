import {
  createDataSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const _getData = createDataSelector('tryCatchErrorsChart');

/**
 * Returns the try catch errors chart data from the state.
 */
export const getTryCatchErrorsChartData = createGetItemsSelector(_getData);
