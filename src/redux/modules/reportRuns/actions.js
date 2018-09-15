import { getPrevCycleGroupStartData, getNextCycleGroupStartData } from './selectors';

export const actionTypes = {
  FETCH_BEGIN: 'reportRuns/FETCH_BEGIN',
  FETCH_SUCCESS: 'reportRuns/FETCH_SUCCESS',
  FETCH_FAIL: 'reportRuns/FETCH_FAIL',
  RESET: 'reportRuns/RESET'
};

/**
 * Action to fetch the report runs.
 */
export const fetchReportRuns = (reportName, cycleGroup = 0, fromNum = '', toNum = '') => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/powerbi_report_runs', {
    params: {
      report_name: reportName,
      from_num: fromNum,
      to_num: toNum
    }
  }),
  payload: {
    reportName,
    currentCycleGroup: cycleGroup
  }
});

/**
 * Action to fetch the previous cycle group before the current cycle group.
 */
export const fetchPrev = () => (dispatch, getState) => {
  const state = getState();
  const { currentCycleGroup, fromNum, toNum } = getPrevCycleGroupStartData(state);
  const { reportName } = state.reportRuns;
  dispatch(fetchReportRuns(reportName, currentCycleGroup, fromNum, toNum));
};

/**
 * Action to fetch the next cycle group after the current cycle group.
 */
export const fetchNext = () => (dispatch, getState) => {
  const state = getState();
  const { currentCycleGroup, fromNum, toNum } = getNextCycleGroupStartData(state);
  const { reportName } = state.reportRuns;
  dispatch(fetchReportRuns(reportName, currentCycleGroup, fromNum, toNum));
};

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
