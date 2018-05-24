import etlControlManager from 'redux/modules/etlControlManager';
import etlServers from 'redux/modules/etlServers';
import CycleHistory from './CycleHistory';
import Error from './Error';
import ProceduresHistory from './ProceduresHistory';
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
  .concat(getUserRoutes(dispatch))
  .concat([
    {
      path: '*',
      component: Error
    }
  ])
);
