import History from './History';
import Statistics from './Statistics';

export default () => [
  {
    path: '/report/history',
    component: History,
    exact: true
  },
  {
    path: '/report/statistics',
    component: Statistics,
    exact: true
  }
];
