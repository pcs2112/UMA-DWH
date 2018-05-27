import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Modal, Header, Button } from 'semantic-ui-react';
import config from 'config';
import globalCss from 'css/global';
import users from 'redux/modules/users';
import withMainLayout from 'components/WithMainLayout';
import UserForm from './UserForm';
import { newUserValidator, existingUserValidator } from './UserForm/validate';
import ListTable from './ListTable';

const emptyInitialValues = {};

class List extends Component {
  static propTypes = {
    usersFetching: PropTypes.bool.isRequired,
    usersDataLoaded: PropTypes.bool.isRequired,
    usersData: PropTypes.array.isRequired,
    usersFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchUsers: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      editing: false,
      editUserId: false,
      editUserInitialValues: emptyInitialValues
    };
  }

  componentDidMount() {
    const { usersFetching, usersDataLoaded, fetchUsers } = this.props;
    if (!usersFetching && !usersDataLoaded) {
      fetchUsers();
    }
  }

  onCreateUserClick = () => {
    this.setState({
      creating: true,
      editing: false
    });
  };

  onEditUserClick = (id) => {
    const currUser = this.props.usersData.find(user => user.id === id);
    this.setState({
      creating: false,
      editing: true,
      editUserId: id,
      editUserInitialValues: {
        employee_first_name: currUser.employee_first_name,
        employee_last_name: currUser.employee_last_name,
        employee_email: currUser.employee_email,
        employee_phone: currUser.employee_phone,
        employee_cell_phone: currUser.employee_cell_phone,
        employee_password: ''
      }
    });
  };

  onCreateUserModalClose = () => {
    this.setState({
      creating: false
    });
  };

  onEditUserModalClose = () => {
    this.setState({
      editing: false,
      editUserId: false,
      editUserInitialValues: emptyInitialValues
    });
  };

  onEditUserSubmit = (data) => {
    const { editUserId } = this.state;
    const { updateUser } = this.props;
    return updateUser(editUserId, data);
  };

  render() {
    const { creating, editing, editUserInitialValues } = this.state;
    const {
      usersFetching, usersDataLoaded, usersData, usersFetchingError, createUser
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - ETL Procedures History
          </h1>
        </Segment>
        <Segment>
          <Button primary onClick={this.onCreateUserClick}>Create User</Button>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={usersFetching}
            dataLoaded={usersDataLoaded}
            data={usersData}
            fetchingError={usersFetchingError}
            onEdit={this.onEditUserClick}
          />
          {creating &&
          <Modal
            open={creating}
            onClose={this.onCreateUserModalClose}
            size="tiny"
            closeIcon
            dimmer="inverted"
            closeOnDimmerClick={false}
          >
            <Header content={<h1>CREATE USER</h1>} />
            <Modal.Content>
              <UserForm
                form="CreateUserForm"
                onSubmit={createUser}
                onSubmitSuccess={this.onCreateUserModalClose}
                validate={newUserValidator}
                isCreate
              />
            </Modal.Content>
          </Modal>
          }
          {editing &&
          <Modal
            open={editing}
            onClose={this.onEditUserModalClose}
            size="tiny"
            closeIcon
            dimmer="inverted"
            closeOnDimmerClick={false}
          >
            <Header content={<h1>EDIT USER</h1>} />
            <Modal.Content>
              <UserForm
                form="EditUserForm"
                initialValues={editUserInitialValues}
                onSubmit={this.onEditUserSubmit}
                onSubmitSuccess={this.onEditUserModalClose}
                validate={existingUserValidator}
                isCreate={false}
              />
            </Modal.Content>
          </Modal>
          }
        </Segment>
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
    createUser: data => dispatch(users.actions.createUser(data)),
    updateUser: (id, data) => dispatch(users.actions.updateUser(id, data)),
  })
)(List));

