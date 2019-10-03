import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import entriesRdx from '../../../../redux/modules/dataLake/entries';
import withEntryForm from '../WithEntryForm';

const Form = withEntryForm();

const CreateEntryModal = ({
  name, open, onClose, onSubmit
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="tiny"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>CREATE ENTRY</h1>} />
    <Modal.Content>
      <Form
        form={`${name}_FORM`}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal.Content>
  </Modal>
);

CreateEntryModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default connectModal(
  CreateEntryModal,
  'modal',
  null,
  dispatch => ({
    onSubmit: data => dispatch(entriesRdx.actions.create(data))
      .then(() => dispatch(entriesRdx.actions.fetch())),
    onClose: () => {
      dispatch(hideModal());
    }
  })
);
