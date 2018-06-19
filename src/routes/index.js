import etlControlManager from 'redux/modules/etlControlManager';
import etlServers from 'redux/modules/etlServers';
import CycleHistory from './CycleHistory';
import Error from './Error';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import ProceduresHistory from './ProceduresHistory';
import getErrorTypeManagementRoutes from './ErrorTypeManagement';
import getPowerbiRoutes from './Powerbi';
import getUserRoutes from './Users';

export default ({ dispatch }) => ([
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
  }
]
  .concat(getErrorTypeManagementRoutes())
  .concat(getPowerbiRoutes())
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
