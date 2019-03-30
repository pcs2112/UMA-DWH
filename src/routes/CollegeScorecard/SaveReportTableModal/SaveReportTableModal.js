import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal } from 'redux-modal';
import collegeScorecardReportsRdx from '../../../redux/modules/collegeScorecardReports';
import SaveReportTableForm from '../SaveReportTableForm';

const SaveReportTableModal = ({
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
    <Header content={<h1>SAVE REPORT IN TABLE</h1>} />
    <Modal.Content>
      <SaveReportTableForm
        form={`${name}_FORM`}
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
    </Modal.Content>
  </Modal>
);

SaveReportTableModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};

export default connectModal(
  SaveReportTableModal,
  'modal',
  state => ({
    initialValues: collegeScorecardReportsRdx.selectors.getNewSaveReportTableFormInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(collegeScorecardReportsRdx.actions.saveReportTable(data))
  })
);
