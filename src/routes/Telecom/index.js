import Reps from './Reps';
import Roles from './Roles';
import Skills from './Skills';
import Workgroups from './Workgroups';

export default () => [
  {
    path: '/telecom/reps',
    component: Reps,
    exact: true
  },
  {
    path: '/telecom/roles',
    component: Roles,
    exact: true
  },
  {
    path: '/telecom/skills',
    component: Skills,
    exact: true
  },
  {
    path: '/telecom/workgroups',
    component: Workgroups,
    exact: true
  }
];
