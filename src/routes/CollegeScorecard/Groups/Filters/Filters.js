import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import DropdownFilter from '../../../../components/DropdownFilter';

class Filters extends Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    fileOptions: PropTypes.array.isRequired,
    onFileChange: PropTypes.func.isRequired
  };

  handleFileFilterOnChange = (value) => {
    const { onFileChange } = this.props;
    onFileChange('fileName', value);
  };

  render() {
    const { fileName, fileOptions } = this.props;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={8}>
            <DropdownFilter
              defaultValue={fileName}
              options={fileOptions}
              onChange={this.handleFileFilterOnChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default Filters;
