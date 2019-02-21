import collegeScorecardFilesReduxModule from 'redux/modules/collegeScorecardFiles';
import Reporting from './Reporting';

export default dispatch => [{
  path: '/college_scorecard/reporting',
  component: Reporting,
  exact: true,
  fetch: () => dispatch(collegeScorecardFilesReduxModule.actions.fetch())
}];
