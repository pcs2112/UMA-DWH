import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal, hideModal } from 'redux-modal';
import categoriesRdx from '../../../../redux/modules/collegeScorecardCategories';
import withCategoryForm from '../WithCategoryForm';

const CategoryForm = withCategoryForm('update');

const UpdateCategoryModal = ({
  name, open, initialValues, files, tables, onClose, onSubmit
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="small"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>UPDATE CATEGORY</h1>} />
    <Modal.Content>
      <CategoryForm
        form={`${name}_FORM`}
        initialValues={initialValues}
        files={files}
        tables={tables}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal.Content>
  </Modal>
);

UpdateCategoryModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  tables: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default connectModal(
  UpdateCategoryModal,
  'modal',
  state => ({
    initialValues: categoriesRdx.selectors.getUpdatingCategoryInitialValues(state)
  }),
  dispatch => ({
    onSubmit: data => dispatch(categoriesRdx.actions.update(data))
      .then(() => dispatch(categoriesRdx.actions.fetch())),
    onClose: () => {
      dispatch(hideModal());
      dispatch(categoriesRdx.actions.updatingEnd());
    }
  })
);
