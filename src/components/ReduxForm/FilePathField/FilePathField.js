import React, { Component } from 'react';
import { Form, Label } from 'semantic-ui-react';
import { fieldProps } from '../FieldPropTypes';

class FilePathField extends Component {
  static propTypes = {
    ...fieldProps
  };

  onChange = (event) => {
    this.props.input.onChange(event.target.files[0].name);
  };

  render() {
    const {
      input,
      label,
      required,
      width,
      inline,
      meta: { touched, error },
      ...rest
    } = this.props;
    return (
      <Form.Field
        error={!!(touched && error)}
        required={required}
        width={width}
        inline={inline}
      >
        {label && <label>{label}</label>}
        <input
          type="file"
          onChange={this.onChange}
          {...rest}
        />
        {touched && error ? (
          <Label basic color="red" pointing>
            {error}
          </Label>
        ) : null}
      </Form.Field>
    );
  }
}

export default FilePathField;
