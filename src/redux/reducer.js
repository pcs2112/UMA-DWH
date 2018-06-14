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
  user: user.reducer,
  users: users.reducer
});
