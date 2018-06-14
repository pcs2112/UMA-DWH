import { createSelector } from 'reselect';

const emptyData = [];
const _getData = state => (state.errorTypeResolution.dataLoaded ? state.errorTypeResolution.data : emptyData);

/**
 * Returns the Error type resolution data.
 */
export const getData = createSelector(
  [_getData],
  data => data
);
