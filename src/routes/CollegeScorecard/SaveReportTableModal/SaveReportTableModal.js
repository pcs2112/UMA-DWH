import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import collegeScorecardReportsRdx from '../../../redux/modules/collegeScorecardReports';

const SaveReportTableModal = ({
  name, open, onClose /* , onSubmit, onSubmitSuccess, initialValues */
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
      tet {name}
    </Modal.Content>
  </Modal>
);

SaveReportTableModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  /* onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired */
};

export default connectModal(
  SaveReportTableModal,
  'modal',
  state => ({
    initialValues: collegeScorecardReportsRdx.selectors.getNewSaveReportTableFormInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(collegeScorecardReportsRdx.actions.update(data)),
    onSubmitSuccess: () => {
      dispatch(hideModal());
    }
  })
);
