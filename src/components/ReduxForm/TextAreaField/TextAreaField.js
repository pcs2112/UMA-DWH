import React from 'react';
import { Form, Label, TextArea } from 'semantic-ui-react';
import { fieldProps } from '../FieldPropTypes';

const TextAreaField = ({
  input,
  label,
  required,
  width,
  inline,
  meta: { touched, error },
  ...rest
}) => (
  <Form.Field
    error={!!(touched && error)}
    required={required}
    width={width}
    inline={inline}
  >
    {label && <label>{label}</label>}
    <TextArea {...input} {...rest} />
    {touched && error ? (
      <Label basic color="red" pointing>
        {error}
      </Label>
    ) : null}
  </Form.Field>
);

TextAreaField.propTypes = {
  ...fieldProps
};

export default TextAreaField;
