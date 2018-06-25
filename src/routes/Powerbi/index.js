import ReportHistory from './ReportHistory';
import ReportStatistics from './ReportStatistics';

export default () => [
  {
    path: '/powerbi/report/history',
    component: ReportHistory,
    exact: true
  },
  {
    path: '/powerbi/report/statistics',
    component: ReportStatistics,
    exact: true
  }
];
