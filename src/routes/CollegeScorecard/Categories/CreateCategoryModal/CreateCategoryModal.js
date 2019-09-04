import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal } from 'redux-modal';
import categoriesRdx from '../../../../redux/modules/collegeScorecardCategories';
import withCategoryForm from '../WithCategoryForm';

const CategoryForm = withCategoryForm('create');

const CreateCategoryModal = ({
  name, open, files, tables, onClose, onSubmit
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="small"
    closeIcon
    dimmer="inverted"
    closeOnDimmerClick={false}
  >
    <Header content={<h1>CREATE CATEGORY</h1>} />
    <Modal.Content>
      <CategoryForm
        form={`${name}_FORM`}
        files={files}
        tables={tables}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal.Content>
  </Modal>
);

CreateCategoryModal.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  files: PropTypes.array.isRequired,
  tables: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connectModal(
  CreateCategoryModal,
  'modal',
  null,
  dispatch => ({
    onSubmit: data => dispatch(categoriesRdx.actions.create(data))
      .then(() => dispatch(categoriesRdx.actions.fetch()))
  })
);
