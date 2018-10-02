import { SubmissionError } from 'redux-form';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';

/**
 * Catch redux-form validation errors.
 * @param {Object} error
 * @returns {Promise}
 */
export const catchValidation = (error) => {
  if (objectHasOwnProperty(error, 'error_type') && error.error_type === 'FORM_VALIDATION_ERROR') {
    const errors = {
      ...error.payload,
      _error: error.message
    };

    throw new SubmissionError(errors);
  }

  throw new SubmissionError({ _error: error.message });
};

/**
 * Returns the value for the specified field name inside the redux-form state.
 * @param {Object} reduxFormState
 * @param {String} fieldName
 */
export const getFormFieldValue = (reduxFormState, fieldName) =>
  (reduxFormState && reduxFormState.values ? reduxFormState.values[fieldName] : '');
