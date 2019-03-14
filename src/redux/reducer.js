import { combineReducers } from 'redux';
import { reduxPollingNamespace, reduxPollingReducer } from 'redux-polling';
import { reducer as form } from 'redux-form';
import { reducer as modal } from 'redux-modal';
import collegeScorecard from './modules/collegeScorecard';
import collegeScorecardFiles from './modules/collegeScorecardFiles';
import collegeScorecardGroups from './modules/collegeScorecardGroups';
import collegeScorecardReports from './modules/collegeScorecardReports';
import errorTypeResolution from './modules/errorTypeResolution';
import etlControlManager from './modules/etlControlManager';
import etlCurrentStatus from './modules/etlCurrentStatus';
import etlProcedureHistory from './modules/etlProcedureHistory';
import etlCycleHistory from './modules/etlCycleHistory';
import etlRunCheck from './modules/etlRunCheck';
import etlServers from './modules/etlServers';
import reports from './modules/reports';
import reportHistory from './modules/reportHistory';
import reportRuntimeChart from './modules/reportRuntimeChart';
import procedureRuntimeChart from './modules/procedureRuntimeChart';
import user from './modules/user';
import users from './modules/users';
import tryCatchErrors from './modules/tryCatchErrors';
import tryCatchErrorsChart from './modules/tryCatchErrorsChart';
import statisticsChart from './modules/statisticsChart';
import statisticsHistory from './modules/statisticsHistory';
import statisticsManagement from './modules/statisticsManagement';
import statisticsSchemas from './modules/statisticsSchemas';

export default () => combineReducers({
  [reduxPollingNamespace]: reduxPollingReducer,
  form,
  modal,
  collegeScorecard: collegeScorecard.reducer,
  collegeScorecardFiles: collegeScorecardFiles.reducer,
  collegeScorecardGroups: collegeScorecardGroups.reducer,
  collegeScorecardReports: collegeScorecardReports.reducer,
  errorTypeResolution: errorTypeResolution.reducer,
  etlControlManager: etlControlManager.reducer,
  etlCurrentStatus: etlCurrentStatus.reducer,
  etlCycleHistory: etlCycleHistory.reducer,
  etlProcedureHistory: etlProcedureHistory.reducer,
  etlRunCheck: etlRunCheck.reducer,
  etlServers: etlServers.reducer,
  reports: reports.reducer,
  reportHistory: reportHistory.reducer,
  reportRuntimeChart: reportRuntimeChart.reducer,
  procedureRuntimeChart: procedureRuntimeChart.reducer,
  user: user.reducer,
  users: users.reducer,
  tryCatchErrors: tryCatchErrors.reducer,
  tryCatchErrorsChart: tryCatchErrorsChart.reducer,
  statisticsChart: statisticsChart.reducer,
  statisticsHistory: statisticsHistory.reducer,
  statisticsManagement: statisticsManagement.reducer,
  statisticsSchemas: statisticsSchemas.reducer
});
