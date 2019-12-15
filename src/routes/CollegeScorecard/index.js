import filesRdx from '../../redux/modules/collegeScorecardFiles';
import formulaTablesRdx from '../../redux/modules/collegeScorecardFormulaTables';
import Reporting from './Reporting';
import Groups from './Groups';
import Categories from './Categories';
import Tasks from './Tasks';

export default dispatch => [
  {
    path: '/college_scorecard/reporting',
    component: Reporting,
    exact: true,
    fetch: () => dispatch(filesRdx.actions.fetch()),
  },
  {
    path: '/college_scorecard/groups',
    component: Groups,
    exact: true,
    fetch: () => dispatch(filesRdx.actions.fetch()),
  },
  {
    path: '/college_scorecard/categories',
    component: Categories,
    exact: true,
    fetch: () => Promise.all([
      dispatch(filesRdx.actions.fetch()),
      dispatch(formulaTablesRdx.actions.fetch()),
    ]),
  },
  {
    path: '/college_scorecard/tasks',
    component: Tasks,
    exact: true,
  },
];
