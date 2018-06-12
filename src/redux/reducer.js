import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as modal } from 'redux-modal';
import etlControlManager from './modules/etlControlManager';
import etlCurrentStatus from './modules/etlCurrentStatus';
import etlProcedureHistory from './modules/etlProcedureHistory';
import etlCycleHistory from './modules/etlCycleHistory';
import etlRunCheck from './modules/etlRunCheck';
import etlServers from './modules/etlServers';
import users from './modules/users';
import user from './modules/user';

export default combineReducers({
  form,
  modal,
  etlControlManager: etlControlManager.reducer,
  etlCurrentStatus: etlCurrentStatus.reducer,
  etlCycleHistory: etlCycleHistory.reducer,
  etlProcedureHistory: etlProcedureHistory.reducer,
  etlRunCheck: etlRunCheck.reducer,
  etlServers: etlServers.reducer,
  users: users.reducer,
  user: user.reducer
});
