import usersModule from 'redux/modules/users';
import List from './List';

export default dispatch => [{
  path: '/users',
  component: List,
  exact: true,
  fetch: () => dispatch(usersModule.actions.fetchUsers())
}];
