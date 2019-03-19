import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Input, Form } from 'semantic-ui-react';
import { FILTERS_EXEC_DELAY } from '../../../constants/index';

class Filters extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  handleOnChange = (e, { value }) => {
    const { onChange } = this.props;
    onChange('query', value);
  };

  render() {
    const { query } = this.props;
    return (
      <Form size="small">
        <Form.Group>
          <Form.Field width={10}>
            <Input
              icon="search"
              placeholder="Filter by TARGET_SCHEMA_TABLE_NAME"
              onChange={this.handleOnChange}
              defaultValue={query}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default Filters;
