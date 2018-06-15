import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import users from 'redux/modules/users';
import withUserForm from '../WithUserForm';

const UserForm = withUserForm('update');

const UpdateUserModal = ({
  name, open, onClose, onSubmit, onSubmitSuccess, initialValues
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="tiny"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>UPDATE USER</h1>} />
    <Modal.Content>
      <UserForm
        form={`${name}_FORM`}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
      />
    </Modal.Content>
  </Modal>
);

UpdateUserModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};

export default connectModal(
  UpdateUserModal,
  'modal',
  state => ({
    initialValues: users.selectors.getUpdatingUserInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(users.actions.updateUser(data.id, data)),
    onSubmitSuccess: () => {
      dispatch(hideModal());
      dispatch(users.actions.updatingUserEnd());
    },
    onClose: () => {
      dispatch(hideModal());
      dispatch(users.actions.updatingUserEnd());
    }
  })
);
