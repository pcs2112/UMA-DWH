import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import entriesRdx from '../../../../redux/modules/dataLake/entries';
import withEntryForm from '../WithEntryForm';

const Form = withEntryForm();

const UpdateEntryModal = ({
  name, open, initialValues, onClose, onSubmit
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="tiny"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>UPDATE ENTRY</h1>} />
    <Modal.Content>
      <Form
        form={`${name}_FORM`}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal.Content>
  </Modal>
);

UpdateEntryModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default connectModal(
  UpdateEntryModal,
  'modal',
  state => ({
    initialValues: entriesRdx.selectors.getUpdatingEntryInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(entriesRdx.actions.update(data))
      .then(() => dispatch(entriesRdx.actions.fetch())),
    onClose: () => {
      dispatch(hideModal());
      dispatch(entriesRdx.actions.updatingEnd());
    }
  })
);
