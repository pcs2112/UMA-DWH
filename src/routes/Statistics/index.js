import statisticsHistoryReduxModule from 'redux/modules/statisticsHistory';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';
import History from './History';
import Management from './Management';

export default dispatch => [{
  path: '/statistics/history',
  component: History,
  exact: true,
  fetch: () => dispatch(statisticsHistoryReduxModule.actions.fetchLastDate())
    .then(() => dispatch(statisticsSchemasReduxModule.actions.fetch()))
},
{
  path: '/statistics/management',
  component: Management,
  exact: true,
  fetch: () => dispatch(statisticsHistoryReduxModule.actions.fetchLastDate())
    .then(() => dispatch(statisticsSchemasReduxModule.actions.fetch()))
}];
