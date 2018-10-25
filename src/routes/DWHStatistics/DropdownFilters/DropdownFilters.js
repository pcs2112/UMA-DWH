import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Dropdown, Form } from 'semantic-ui-react';
import { FILTERS_EXEC_DELAY } from 'constants/index';
import monthFilterOptions from 'constants/monthFilterOptions';

class DropdownFilters extends Component {
  static propTypes = {
    schemas: PropTypes.array.isRequired,
    schema: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    months: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      schema: props.schema,
      months: props.months
    };

    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  getSchemaOptions = () => this.props.schemas.map((schema) => {
    const schemaName = schema.name;
    return {
      key: schemaName,
      value: schemaName,
      text: schemaName
    };
  });

  handleSchemaOnChange = (e, { value }) => {
    if (value !== this.state.schema) {
      this.setState({
        schema: value
      }, this.handleOnChange);
    }
  };

  handleMonthsOnChange = (e, { value }) => {
    if (value !== this.state.months) {
      this.setState({
        months: parseInt(value, 10)
      }, this.handleOnChange);
    }
  };

  handleOnChange = () => {
    const { schema, months } = this.state;
    const { date, onChange } = this.props;
    onChange(schema, date, months);
  };

  render() {
    const { schema, months } = this.state;
    const { date } = this.props;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={3}>
            <div className="right-aligned-label">
              <label>Schema</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              key={date.replace(/-/g, '')}
              selectOnNavigation={false}
              selection
              name="false"
              options={this.getSchemaOptions()}
              onChange={this.handleSchemaOnChange}
              value={schema}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group inline>
          <Form.Field width={3}>
            <div className="right-aligned-label">
              <label>Chart Date Range</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              fluid
              selectOnNavigation={false}
              selection
              name="false"
              options={monthFilterOptions}
              onChange={this.handleMonthsOnChange}
              value={months}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default DropdownFilters;
