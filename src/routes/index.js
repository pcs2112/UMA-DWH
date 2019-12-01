import etlControlManagerDetails from '../redux/modules/etlControlManagerDetails';
import etlServers from '../redux/modules/etlServers';
import reports from '../redux/modules/reports';
import reportHistory from '../redux/modules/reportHistory';
import getCollegeScorecardRoutes from './CollegeScorecard';
import CycleHistory from './CycleHistory';
import Management from './Management';
import getTelecomRoutes from './Telecom';
import DWHErrors from './DWHErrors';
import Error from './Error';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import ProceduresHistory from './ProceduresHistory';
import getErrorTypeManagementRoutes from './ErrorTypeManagement';
import ReportsHistory from './ReportsHistory';
import getStatisticsRoutes from './Statistics';
import getUserRoutes from './Users';
import getDataLakeRoutes from './DataLake';
import getDataCubesRoutes from './DataCubes';
import getEtlRoutes from './Etl';

export default ({ dispatch, getState }) => ([
  {
    path: '/',
    component: CycleHistory,
    exact: true,
    fetch: () => dispatch(etlControlManagerDetails.actions.fetch())
  },
  {
    path: '/management',
    component: Management,
    exact: true
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
    fetch: () => dispatch(reportHistory.actions.fetchLastDate())
      .then(() => dispatch(reports.actions.fetch(getState().reportHistory.date)))
  },
  {
    path: '/dwh/errors',
    component: DWHErrors,
    exact: true
  }
]
  .concat(getErrorTypeManagementRoutes())
  .concat(getStatisticsRoutes(dispatch))
  .concat(getUserRoutes(dispatch))
  .concat(getCollegeScorecardRoutes(dispatch))
  .concat(getTelecomRoutes(dispatch))
  .concat(getDataLakeRoutes(dispatch))
  .concat(getDataCubesRoutes(dispatch))
  .concat(getEtlRoutes())
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
