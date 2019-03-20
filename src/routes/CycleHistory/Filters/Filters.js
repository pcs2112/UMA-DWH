import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import SearchInput from '../../../components/SearchInput';

class Filters extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  handleSearchInputOnChange = (value) => {
    const { onChange } = this.props;
    onChange('query', value);
  };

  render() {
    const { query } = this.props;
    return (
      <Form size="small">
        <Form.Group>
          <Form.Field width={13}>
            <SearchInput
              defaultValue={query}
              placeholder="Filter by TARGET_SCHEMA_TABLE_NAME"
              onChange={this.handleSearchInputOnChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default Filters;
