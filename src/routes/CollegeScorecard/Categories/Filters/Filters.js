import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import InputFilter from '../../../../components/InputFilter';

class Filters extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    onQueryChange: PropTypes.func.isRequired
  };

  handleQueryFilterOnChange = (value) => {
    const { onQueryChange } = this.props;
    onQueryChange('query', value);
  };

  render() {
    const { query } = this.props;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={10}>
            <InputFilter
              defaultValue={query}
              placeholder="Filter by CATEGORY_NAME and WHERE_TABLE"
              onChange={this.handleQueryFilterOnChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default Filters;
