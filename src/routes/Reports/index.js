import ReportHistory from './ReportHistory';
import ReportStatistics from './ReportStatistics';

export default () => [
  {
    path: '/report/history',
    component: ReportHistory,
    exact: true
  },
  {
    path: '/report/statistics',
    component: ReportStatistics,
    exact: true
  }
];
