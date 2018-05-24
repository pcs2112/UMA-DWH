import React from 'react';
import { Form, Label, Radio } from 'semantic-ui-react';
import { fieldProps } from '../FieldPropTypes';

const RadioField = ({
  input,
  label,
  required,
  width,
  meta: { touched, error },
  ...custom
}) => (
  <Form.Field
    error={!!(touched && error)}
    required={required}
    width={width}
    {...custom}
  >
    <Radio
      label={label}
      checked={!!input.value}
      onClick={(event, data) => input.onChange(data.checked)}
    />
    {touched && error ? (
      <Label basic color="red" pointing>
        {error}
      </Label>
    ) : null}
  </Form.Field>
);

RadioField.propTypes = {
  ...fieldProps
};

export default RadioField;
