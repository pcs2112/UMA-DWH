import { createSelector } from 'reselect';

const emptyData = [];
const getData = state => (state.etlControlManager.dataLoaded ? state.etlControlManager.data : emptyData);

/**
 * Returns the ETL control manager data from the state.
 */
export const controlManager = createSelector(
  [getData],
  data => data
);
