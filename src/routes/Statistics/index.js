import statisticsHistoryReduxModule from 'redux/modules/statisticsHistory';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';
import History from './History';

export default dispatch => [{
  path: '/statistics/history',
  component: History,
  exact: true,
  fetch: () => dispatch(statisticsHistoryReduxModule.actions.fetchLastDate())
    .then(() => dispatch(statisticsSchemasReduxModule.actions.fetch()))
}];
