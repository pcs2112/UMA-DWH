import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal } from 'redux-modal';
import collegeScorecardReportsReduxModule from '../../../redux/modules/collegeScorecardReports';
import withReportForm from '../WithReportForm';

const ReportForm = withReportForm('update');

const UpdateReportModal = ({
  name, open, onClose, onSubmit, initialValues
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="tiny"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>SAVE REPORT</h1>} />
    <Modal.Content>
      <ReportForm
        form={`${name}_FORM`}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal.Content>
  </Modal>
);

UpdateReportModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};

export default connectModal(
  UpdateReportModal,
  'modal',
  state => ({
    initialValues: collegeScorecardReportsReduxModule.selectors.getExistingReportFormInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(collegeScorecardReportsReduxModule.actions.update(data))
  })
);
