import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import InputFilter from '../../../../components/InputFilter';
import DropdownFilter from '../../../../components/DropdownFilter';

class Filters extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileOptions: PropTypes.array.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onFileChange: PropTypes.func.isRequired
  };

  handleQueryFilterOnChange = (value) => {
    const { onQueryChange } = this.props;
    onQueryChange('query', value);
  };

  handleFileFilterOnChange = (value) => {
    const { onFileChange } = this.props;
    onFileChange('fileName', value);
  };

  render() {
    const { query, fileName, fileOptions } = this.props;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={8}>
            <InputFilter
              defaultValue={query}
              placeholder="Filter by COLUMN_NAME and DESCRIPTION"
              onChange={this.handleQueryFilterOnChange}
            />
          </Form.Field>
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
