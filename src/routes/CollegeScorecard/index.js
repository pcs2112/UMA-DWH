import collegeScorecardFilesReduxModule from '../../redux/modules/collegeScorecardFiles';
import Reporting from './Reporting';
import Groups from './Groups';
import Categories from './Categories';

export default dispatch => [
  {
    path: '/college_scorecard/reporting',
    component: Reporting,
    exact: true,
    fetch: () => dispatch(collegeScorecardFilesReduxModule.actions.fetch())
  },
  {
    path: '/college_scorecard/groups',
    component: Groups,
    exact: true,
    fetch: () => dispatch(collegeScorecardFilesReduxModule.actions.fetch())
  },
  {
    path: '/college_scorecard/categories',
    component: Categories,
    exact: true
  }
];
