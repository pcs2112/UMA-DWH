import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import { fieldProps } from '../FieldPropTypes';

const Item = ({ entity: { name, char } }) => <div>{`${name}: ${char}`}</div>; // eslint-disable-line
const Loading = () => <div>Loading</div>;

const TextAreaAutocompleteField = ({
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
    <ReactTextareaAutocomplete
      {...input}
      {...rest}
      loadingComponent={Loading}
      minChar={0}
      trigger={{
        ':': {
          component: Item,
          output: item => item.char,
          dataProvider: (token) => {
            console.log(token);
            return [
              { name: 'test1', char: 'test1' },
              { name: 'test2', char: 'test2' },
              { name: 'tes3', char: 'test3' }
            ]
              .slice(0, 10)
              .map(({ name, char }) => ({ name, char }));
          }
        }
      }}
    />
    {touched && error ? (
      <Label basic color="red" pointing>
        {error}
      </Label>
    ) : null}
  </Form.Field>
);

TextAreaAutocompleteField.propTypes = {
  ...fieldProps
};

export default TextAreaAutocompleteField;
