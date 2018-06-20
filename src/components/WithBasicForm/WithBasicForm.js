import React from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'javascript-utils/lib/react';
import { isEmpty } from 'javascript-utils/lib/utils';
import { Form } from 'semantic-ui-react';
import FormError from 'components/FormError';

const withBasicForm = (WrappedComponent) => {
  const WithBasicForm = ({
    submitting, error, handleSubmit, onSubmit, formSize, ...rest
  }) => (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      size={formSize}
      error={!isEmpty(error)}
    >
      {error && <FormError error={error} />}
      <WrappedComponent
        submitting={submitting}
        formSize={formSize}
        {...rest}
      />
    </Form>
  );

  WithBasicForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    formSize: PropTypes.string,
    formButtonSize: PropTypes.string
  };

  WithBasicForm.defaultProps = {
    formSize: 'small',
    formButtonSize: 'small'
  };

  WithBasicForm.displayName = `WithBasicForm(${getDisplayName(WrappedComponent)})`;

  return WithBasicForm;
};

export default withBasicForm;
