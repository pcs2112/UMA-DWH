import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import errorTypeResolution from 'redux/modules/errorTypeResolution';
import withFileForm from '../WithFileForm';

const FileForm = withFileForm('create');

const CreateFileModal = ({
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
    <Header content={<h1>CREATE ERROR TYPE MANAGEMENT FILE</h1>} />
    <Modal.Content>
      <FileForm
        form={`${name}_FORM`}
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
      />
    </Modal.Content>
  </Modal>
);

CreateFileModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired
};

export default connectModal(
  CreateFileModal,
  'modal',
  null,
  dispatch => ({
    onSubmit: data => dispatch(errorTypeResolution.actions.createFile(data)),
    onSubmitSuccess: () => {
      dispatch(hideModal());
    }
  })
);
