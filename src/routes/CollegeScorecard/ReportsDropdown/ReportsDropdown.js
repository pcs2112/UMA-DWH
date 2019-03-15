import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Dropdown } from 'semantic-ui-react';
import { FILTERS_EXEC_DELAY } from '../../../constants/index';

class ReportsDropdown extends Component {
  static propTypes = {
    reports: PropTypes.array.isRequired,
    reportId: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  getOptions = () => this.props.reports.map(item => ({
    key: item.id,
    value: item.id,
    text: item.report_name
  }));

  handleReportOnChange = (e, { value }) => {
    if (value !== this.props.reportId) {
      this.handleOnChange(value);
    }
  };

  handleOnChange = (reportId) => {
    const { onChange } = this.props;
    onChange(reportId);
  };

  render() {
    const { reportId, className } = this.props;
    return (
      <Dropdown
        fluid
        selectOnNavigation={false}
        selection
        name="false"
        options={this.getOptions()}
        onChange={this.handleReportOnChange}
        value={reportId}
        placeholder="Select a report"
        className={className}
      />
    );
  }
}

export default ReportsDropdown;
