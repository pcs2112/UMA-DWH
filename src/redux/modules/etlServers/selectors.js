import { createSelector } from 'reselect';

const emptyData = [];
const getData = state => (state.etlServers.dataLoaded ? state.etlServers.data : emptyData);

/**
 * Returns the ETL servers from the state.
 */
export const servers = createSelector(
  [getData],
  data => (data.length > 0 ? data : emptyData)
);
