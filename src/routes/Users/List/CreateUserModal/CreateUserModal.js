import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import users from 'redux/modules/users';
import withUserForm from '../WithUserForm';

const UserForm = withUserForm('create');

const CreateUserModal = ({
  name, open, onClose, onSubmit, onSubmitSuccess
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="tiny"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>CREATE USER</h1>} />
    <Modal.Content>
      <UserForm
        form={`${name}_FORM`}
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
      />
    </Modal.Content>
  </Modal>
);

CreateUserModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired
};

export default connectModal(
  CreateUserModal,
  'modal',
  null,
  dispatch => ({
    onSubmit: data => dispatch(users.actions.createUser(data)),
    onSubmitSuccess: () => {
      dispatch(hideModal());
    }
  })
);
