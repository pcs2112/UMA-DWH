import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from 'components/WithResponsiveTable';

const keyName = 'report_name';

/**
 * Table columns
 */
const columns = [
  {
    Header: 'REPORT_NAME',
    accessor: 'report_name',
    width: 250
  },
  {
    Header: 'DAY_COUNT',
    accessor: 'day_count',
    width: 80,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'DAY_AVG_RUN_TIME',
    accessor: 'day_avg_run_time',
    width: 120,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'DAY_AVG_ROWS_RETURNED',
    accessor: 'day_avg_rows_returned',
    width: 150,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'WEEK_COUNT',
    accessor: 'week_count',
    width: 80,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'WEEK_AVG_RUN_TIME',
    accessor: 'week_avg_run_time',
    width: 120,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'WEEK_AVG_ROWS_RETURNED',
    accessor: 'week_avg_rows_returned',
    width: 160,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'LAST_30_DAY_COUNT',
    accessor: 'last_30_day_count',
    width: 120,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'LAST_30_AVG_RUN_TIME',
    accessor: 'last_30_day_avg_run_time',
    width: 140,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'LAST_30_DAY_AVG_ROWS_RETURNED',
    accessor: 'last_30_day_avg_rows_returned',
    width: 200,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  }
];

class ReportStatisticsTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.tableHeight !== this.props.tableHeight
      || nextProps.isFetching !== this.props.isFetching
      || nextProps.dataLoaded !== this.props.dataLoaded
      || nextProps.data !== this.props.data
      || nextProps.fetchingError !== this.props.fetchingError;
  }

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the Power BI report statistics. Please refresh.';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <ReactTable
        data={data}
        columns={columns}
        style={{
          height: `${tableHeight}px`
        }}
        manual
        showPaginationBottom={false}
        sortable={false}
        className="-striped"
        loading={isFetching || fetchingError}
        loadingText={this.getLoadingText()}
        noDataText={dataLoaded ? '0 Power BI report statistics records found.' : ''}
        keyField={keyName}
        resizable={false}
      />
    );
  }
}

export default withResponsiveTable(ReportStatisticsTable, 530, 140);
