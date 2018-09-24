import etlControlManager from 'redux/modules/etlControlManager';
import etlServers from 'redux/modules/etlServers';
import reports from 'redux/modules/reports';
import CycleHistory from './CycleHistory';
import DWHErrors from './DWHErrors';
import Error from './Error';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import ProceduresHistory from './ProceduresHistory';
import getErrorTypeManagementRoutes from './ErrorTypeManagement';
import ReportsHistory from './ReportsHistory';
import getUserRoutes from './Users';

export default ({ dispatch, getState }) => ([
  {
    path: '/',
    component: CycleHistory,
    exact: true,
    fetch: () => dispatch(etlControlManager.actions.fetchControlManager())
  },
  {
    path: '/procedures/history',
    component: ProceduresHistory,
    exact: true,
    fetch: () => dispatch(etlServers.actions.fetchServers())
  },
  {
    path: '/reports/history',
    component: ReportsHistory,
    exact: true,
    fetch: () => dispatch(reports.actions.fetch(getState().reports.date))
  },
  {
    path: '/errors/dwh',
    component: DWHErrors,
    exact: true
  }
]
  .concat(getErrorTypeManagementRoutes())
  .concat(getUserRoutes(dispatch))
  .concat([
    {
      path: '/login',
      component: Login,
      exact: true
    },
    {
      path: '/forgot',
      component: ForgotPassword,
      exact: true
    },
    {
      path: '*',
      component: Error
    }
  ])
);
