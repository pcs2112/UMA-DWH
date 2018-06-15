import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import errorTypeResolution from 'redux/modules/errorTypeResolution';
import withFileForm from '../WithFileForm';

const FileForm = withFileForm('update');

const UpdateFileModal = ({
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
    <Header content={<h1>UPDATE ERROR TYPE MANAGEMENT FILE</h1>} />
    <Modal.Content>
      <FileForm
        form={`${name}_FORM`}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
      />
    </Modal.Content>
  </Modal>
);

UpdateFileModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};

export default connectModal(
  UpdateFileModal,
  'modal',
  state => ({
    initialValues: errorTypeResolution.selectors.getUpdatingFileInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(errorTypeResolution.actions.updateFile(data.id, data)),
    onSubmitSuccess: () => {
      dispatch(hideModal());
      dispatch(errorTypeResolution.actions.updatingFileEnd());
    },
    onClose: () => {
      dispatch(hideModal());
      dispatch(errorTypeResolution.actions.updatingFileEnd());
    }
  })
);
