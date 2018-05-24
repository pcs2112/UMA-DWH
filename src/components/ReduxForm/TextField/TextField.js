import React from 'react';
import { Form, Label, Input } from 'semantic-ui-react';
import { fieldProps } from '../FieldPropTypes';

const TextField = ({
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
    <Input {...input} {...rest} />
    {touched && error ? (
      <Label basic color="red" pointing>
        {error}
      </Label>
    ) : null}
  </Form.Field>
);

TextField.propTypes = {
  ...fieldProps
};

export default TextField;
