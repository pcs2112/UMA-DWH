import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Modal, Header, Button } from 'semantic-ui-react';
import config from 'config';
import globalCss from 'css/global';
import users from 'redux/modules/users';
import UserForm from './UserForm';
import ListTable from './ListTable';

const emptyInitialValues = {};

class List extends Component {
  static propTypes = {
    usersFetching: PropTypes.bool.isRequired,
    usersDataLoaded: PropTypes.bool.isRequired,
    usersData: PropTypes.array.isRequired,
    usersFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchUsers: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      editing: false,
      initialValues: emptyInitialValues
    };
  }

  componentDidMount() {
    const { usersFetching, usersDataLoaded, fetchUsers } = this.props;
    if (!usersFetching && !usersDataLoaded) {
      fetchUsers();
    }
  }

  onCreate = () => {
    this.setState({
      creating: true,
      editing: false
    });
  };

  onEdit = (id) => {
    const currUser = this.props.usersData.find(user => user.id === id);
    this.setState({
      creating: false,
      editing: true,
      initialValues: {
        employee_first_name: currUser.employee_first_name,
        employee_last_name: currUser.employee_last_name,
        employee_email: currUser.employee_email,
        employee_phone: currUser.employee_phone,
        employee_cell_phone: currUser.employee_cell_phone
      }
    });
  };

  onCreateClose = () => {
    this.setState({
      creating: false
    });
  };

  onEditClose = () => {
    this.setState({
      editing: false,
      initialValues: emptyInitialValues
    });
  };

  render() {
    const { creating, editing, initialValues } = this.state;
    const {
      usersFetching, usersDataLoaded, usersData, usersFetchingError
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - ETL Procedures History
          </h1>
        </Segment>
        <Segment>
          <Button primary onClick={this.onCreate}>Create User</Button>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={usersFetching}
            dataLoaded={usersDataLoaded}
            data={usersData}
            fetchingError={usersFetchingError}
            onEdit={this.onEdit}
          />
          {creating &&
          <Modal
            open={creating}
            onClose={this.onCreateClose}
            size="tiny"
            closeIcon
            dimmer="inverted"
          >
            <Header content={<h1>CREATE USER</h1>} />
            <Modal.Content>
              <UserForm
                form="CreateUserForm"
                onSubmit={() => {}}
              />
            </Modal.Content>
          </Modal>
          }
          {editing &&
          <Modal
            open={editing}
            onClose={this.onEditClose}
            size="tiny"
            closeIcon
            dimmer="inverted"
          >
            <Header content={<h1>EDIT USER</h1>} />
            <Modal.Content>
              <UserForm
                form="EditUserForm"
                initialValues={initialValues}
                onSubmit={() => {}}
              />
            </Modal.Content>
          </Modal>
          }
        </Segment>
      </div>
    );
  }
}

export default connect(
  state => ({
    usersFetching: state.users.isFetching,
    usersDataLoaded: state.users.dataLoaded,
    usersData: users.selectors.getUsers(state),
    usersFetchingError: users.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchUsers: () => dispatch(users.actions.fetchUsers())
  })
)(List);

