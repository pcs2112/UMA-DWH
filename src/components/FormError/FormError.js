import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import withFormError from 'components/WithFormError';
import { DEFAULT_FORM_ERROR } from 'constants/index';

const FormError = ({ error }) => (
  <Message
    error
    header="Error"
    content={error}
  />
);

FormError.propTypes = {
  error: PropTypes.string.isRequired
};

export default withFormError(FormError, DEFAULT_FORM_ERROR);
