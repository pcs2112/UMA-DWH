import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import { createUrl } from 'javascript-utils/lib/url';
import withResponsiveTable from 'components/WithResponsiveTable';
import globalCss from 'css/global';

const keyName = 'id';
const noTrProps = {};

/**
 * Table columns
 */
const columns = [
  {
    Header: 'REPORT_NAME',
    accessor: 'report_name',
    Cell: row => (
      <Link to={createUrl('/powerbi/report/statistics', {
        report: row.original.report_name
      })}
      >
        {row.original.report_name}
      </Link>
    )
  },
  {
    Header: 'FROM_DTTM',
    accessor: 'from_dttm',
    width: 140
  },
  {
    Header: 'TO_DTTM',
    accessor: 'to_dttm',
    width: 140
  },
  {
    Header: 'STORED_PROCEDURE',
    accessor: 'stored_procedure'
  },
  {
    Header: 'SOURCE_TABLE_NAME',
    accessor: 'source_table_name'
  },
  {
    Header: 'STARTED',
    accessor: 'started',
    width: 140
  },
  {
    Header: 'FINISHED',
    accessor: 'finished',
    width: 140
  },
  {
    Header: 'RUN_TIME',
    accessor: 'run_time',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'ROWS',
    accessor: 'rows_returned',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  }
];

class ReportHistoryTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.isFetching !== this.props.isFetching
      || nextProps.dataLoaded !== this.props.dataLoaded
      || nextProps.data !== this.props.data
      || nextProps.fetchingError !== this.props.fetchingError;
  }

  getTrProps = (state, row) => {
    if (!row) {
      return noTrProps;
    }

    let color = 'none';
    if (row.original.error_message) {
      color = globalCss.colors.error;
    }

    if (color === 'none') {
      return noTrProps;
    }

    return {
      style: {
        backgroundColor: color
      }
    };
  };

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the Power BI report history. Please refresh.';
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
        noDataText={dataLoaded ? '0 Power BI report history records found.' : ''}
        getTrProps={this.getTrProps}
        keyField={keyName}
        resizable={false}
      />
    );
  }
}

export default withResponsiveTable(ReportHistoryTable, 530, 230);
