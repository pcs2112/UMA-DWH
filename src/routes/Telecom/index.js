import Reps from './Reps';
import Skills from './Skills';

export default () => [
  {
    path: '/telecom/reps',
    component: Reps,
    exact: true
  },
  {
    path: '/telecom/skills',
    component: Skills,
    exact: true
  }
];
