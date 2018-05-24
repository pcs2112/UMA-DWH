import React from 'react';
import { Form, Label, Select } from 'semantic-ui-react';
import { optionsFieldProps } from '../FieldPropTypes';

const SelectField = ({
  input,
  label,
  required,
  width,
  inline,
  options,
  meta: { touched, error },
  ...custom
}) => (
  <Form.Field
    error={!!(touched && error)}
    required={required}
    width={width}
    inline={inline}
  >
    {label && <label>{label}</label>}
    <Select
      search
      value={input.value}
      options={options}
      onChange={(event, data) => input.onChange(data.value)}
      {...custom}
    />
    {touched && error ? (
      <Label basic color="red" pointing>
        {error}
      </Label>
    ) : null}
  </Form.Field>
);

SelectField.propTypes = {
  ...optionsFieldProps
};

export default SelectField;
