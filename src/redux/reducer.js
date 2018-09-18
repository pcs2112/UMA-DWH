import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as modal } from 'redux-modal';
import errorTypeResolution from './modules/errorTypeResolution';
import etlControlManager from './modules/etlControlManager';
import etlCurrentStatus from './modules/etlCurrentStatus';
import etlProcedureHistory from './modules/etlProcedureHistory';
import etlCycleHistory from './modules/etlCycleHistory';
import etlRunCheck from './modules/etlRunCheck';
import etlServers from './modules/etlServers';
import reports from './modules/reports';
import reportHistory from './modules/reportHistory';
import reportRuns from './modules/reportRuns';
import reportRuntimeChart from './modules/reportRuntimeChart';
import reportStatistics from './modules/reportStatistics';
import procedureRuntimeChart from './modules/procedureRuntimeChart';
import user from './modules/user';
import users from './modules/users';

export default combineReducers({
  form,
  modal,
  errorTypeResolution: errorTypeResolution.reducer,
  etlControlManager: etlControlManager.reducer,
  etlCurrentStatus: etlCurrentStatus.reducer,
  etlCycleHistory: etlCycleHistory.reducer,
  etlProcedureHistory: etlProcedureHistory.reducer,
  etlRunCheck: etlRunCheck.reducer,
  etlServers: etlServers.reducer,
  reports: reports.reducer,
  reportHistory: reportHistory.reducer,
  reportRuns: reportRuns.reducer,
  reportRuntimeChart: reportRuntimeChart.reducer,
  reportStatistics: reportStatistics.reducer,
  procedureRuntimeChart: procedureRuntimeChart.reducer,
  user: user.reducer,
  users: users.reducer
});
