import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import InputFilter from '../../../components/InputFilter';

class Filters extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  handleInputFilterOnChange = (value) => {
    const { onChange } = this.props;
    onChange('query', value);
  };

  render() {
    const { query } = this.props;
    return (
      <Form size="small">
        <Form.Group>
          <Form.Field width={10}>
            <InputFilter
              defaultValue={query}
              placeholder="Filter by TARGET_SCHEMA_TABLE_NAME and STORED_PROCEDURE"
              onChange={this.handleInputFilterOnChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default Filters;
