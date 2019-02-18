import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import { showModal } from 'redux-modal';
import users from 'redux/modules/users';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import ListTable from './ListTable';
import CreateUserModal from './CreateUserModal';
import UpdateUserModal from './UpdateUserModal';

const CREATE_USER_MODAL = 'CREATE_USER_MODAL';
const UPDATE_USER_MODAL = 'UPDATE_USER_MODAL';

class List extends Component {
  static propTypes = {
    usersFetching: PropTypes.bool.isRequired,
    usersDataLoaded: PropTypes.bool.isRequired,
    usersData: PropTypes.array.isRequired,
    usersFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchUsers: PropTypes.func.isRequired,
    onCreateUserClick: PropTypes.func.isRequired,
    onUpdateUserClick: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { usersFetching, usersDataLoaded, fetchUsers } = this.props;
    if (!usersFetching && !usersDataLoaded) {
      fetchUsers();
    }
  }

  render() {
    const {
      usersFetching,
      usersDataLoaded,
      usersData,
      usersFetchingError,
      onCreateUserClick,
      onUpdateUserClick
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {__APP_TITLE__} - ETL Procedures History
          </h1>
        </Segment>
        <Segment>
          <Button primary onClick={onCreateUserClick}>Create User</Button>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={usersFetching}
            dataLoaded={usersDataLoaded}
            data={usersData}
            fetchingError={usersFetchingError}
            onEdit={onUpdateUserClick}
          />
        </Segment>
        <CreateUserModal
          name={CREATE_USER_MODAL}
        />
        <UpdateUserModal
          name={UPDATE_USER_MODAL}
        />
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    usersFetching: state.users.isFetching,
    usersDataLoaded: state.users.dataLoaded,
    usersData: users.selectors.getUsers(state),
    usersFetchingError: users.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchUsers: () => dispatch(users.actions.fetchUsers()),
    onCreateUserClick: () => {
      dispatch(showModal(CREATE_USER_MODAL));
    },
    onUpdateUserClick: (id) => {
      dispatch(users.actions.updatingUserStart(id));
      dispatch(showModal(UPDATE_USER_MODAL));
    }
  })
)(List));
