import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Dropdown, Form } from 'semantic-ui-react';
import { FILTERS_EXEC_DELAY } from 'constants/index';
import monthFilterOptions from 'constants/monthFilterOptions';

class DropdownFilters extends Component {
  static propTypes = {
    reports: PropTypes.array.isRequired,
    reportName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    months: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      reportName: props.reportName,
      months: props.months
    };

    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  getReportOptions = () => this.props.reports.map((report) => {
    const reportName = report.calling_proc;
    return {
      key: reportName,
      value: reportName,
      text: reportName
    };
  });

  handleReportNameOnChange = (e, { value }) => {
    if (value !== this.state.reportName) {
      this.setState({
        reportName: value
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
    const { reportName, months } = this.state;
    const { date, onChange } = this.props;
    onChange(reportName, date, months);
  };

  render() {
    const { reportName, months } = this.state;
    const { date } = this.props;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={3}>
            <div className="right-aligned-label">
              <label>Report</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              key={date.replace(/-/g, '')}
              selectOnNavigation={false}
              selection
              name="false"
              options={this.getReportOptions()}
              onChange={this.handleReportNameOnChange}
              value={reportName}
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
