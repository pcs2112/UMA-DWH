import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox } from 'semantic-ui-react';
import InputFilter from '../../../components/InputFilter';

class Filters extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    hide911: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  };

  handleInputFilterOnChange = (value) => {
    const { onChange } = this.props;
    onChange('query', value);
  };

  handleCheckboxFilterOnChange = (event, { checked }) => {
    const { onChange } = this.props;
    onChange('hide911', checked);
  };

  render() {
    const { query, hide911 } = this.props;
    return (
      <Form size="small">
        <Form.Group>
          <Form.Field width={10}>
            <InputFilter
              defaultValue={query}
              placeholder="Filter by PROCEDURE and ERROR_MESSAGE"
              onChange={this.handleInputFilterOnChange}
            />
          </Form.Field>
          <Form.Field width={6}>
            <Checkbox
              label="Hide 911 errors"
              checked={!!hide911}
              onClick={this.handleCheckboxFilterOnChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default Filters;
