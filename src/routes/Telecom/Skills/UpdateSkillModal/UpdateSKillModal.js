import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import skillsRdx from '../../../../redux/modules/telecom/skills';
import withSkillForm from '../WithSkillForm';

const Form = withSkillForm();

const UpdateSkillModal = ({
  name, open, initialValues, updateTypes, onClose, onSubmit
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="tiny"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>UPDATE SKILL</h1>} />
    <Modal.Content>
      <Form
        form={`${name}_FORM`}
        initialValues={initialValues}
        updateTypes={updateTypes}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal.Content>
  </Modal>
);

UpdateSkillModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  updateTypes: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default connectModal(
  UpdateSkillModal,
  'modal',
  state => ({
    initialValues: skillsRdx.selectors.getUpdatingSkillInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(skillsRdx.actions.update(data))
      .then(() => dispatch(skillsRdx.actions.fetch())),
    onClose: () => {
      dispatch(hideModal());
      dispatch(skillsRdx.actions.updatingEnd());
    }
  })
);
