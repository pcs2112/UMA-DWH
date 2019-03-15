import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Dropdown } from 'semantic-ui-react';
import { isEmpty } from 'javascript-utils/lib/utils';
import { FILTERS_EXEC_DELAY } from '../../../constants/index';

class ReportsDropdown extends Component {
  static propTypes = {
    reports: PropTypes.array.isRequired,
    reportId: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  getOptions = () => {
    const options = [{
      key: '-1',
      value: '',
      text: 'Select a report'
    }];

    const { reports } = this.props;
    reports.forEach((item) => {
      options.push({
        key: item.id,
        value: item.id,
        text: item.report_name
      });
    });

    return options;
  };

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
    const { reportId, className, disabled } = this.props;
    return (
      <Dropdown
        fluid
        selectOnNavigation={false}
        selection
        name="false"
        options={this.getOptions()}
        onChange={this.handleReportOnChange}
        value={isEmpty(reportId) ? '' : reportId}
        placeholder="Select a report"
        className={className}
        disabled={disabled}
      />
    );
  }
}

export default ReportsDropdown;
