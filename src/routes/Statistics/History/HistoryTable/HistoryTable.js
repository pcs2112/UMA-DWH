import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from 'components/WithResponsiveTable';
import globalCss from 'css/global';

const keyName = 'id';
const noTrProps = {};

/**
 * Table columns
 */
const columns = [
  {
    Header: 'START_DTTM',
    accessor: 'start_dttm',
    width: 110
  },
  {
    Header: 'RUN_TIME',
    accessor: 'run_time_hh_mm_ss_ms',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'TABLE_FULL',
    accessor: 'table_full',
    width: 500
  },
  {
    Header: 'SERVER',
    accessor: 'server',
    width: 120
  },
  {
    Header: 'DATABASE',
    accessor: 'database',
    width: 150
  },
  {
    Header: 'SCHEMA',
    accessor: 'schema',
    width: 100
  },
  {
    Header: 'TABLE',
    accessor: 'table',
    width: 220
  },
  {
    Header: 'STATISTICS_METHOD',
    accessor: 'statistics_method',
    width: 150
  },
  {
    Header: 'ERROR_PROCEDURE',
    accessor: 'error_procedure',
    width: 300
  },
  {
    Header: 'ERROR_MESSAGE',
    accessor: 'error_message',
    minWidth: 300
  }
];

class HistoryTable extends Component {
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

  getTrProps = (state, row) => {
    if (!row) {
      return noTrProps;
    }

    let bgColor = 'none';
    let textColor = '#000';
    if (row.original.err > 0 || row.original.try_catch_err_id > 0) {
      bgColor = globalCss.colors.error;
      textColor = '#FFF';
    }

    if (bgColor === 'none') {
      return noTrProps;
    }

    return {
      style: {
        backgroundColor: bgColor,
        color: textColor
      }
    };
  };

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the Statistics history. Please refresh.';
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
        minRows={100}
        showPaginationBottom={false}
        sortable={false}
        className="-striped"
        loading={isFetching || fetchingError}
        loadingText={this.getLoadingText()}
        noDataText={dataLoaded ? '0 Statistics history records found.' : ''}
        getTrProps={this.getTrProps}
        keyField={keyName}
      />
    );
  }
}

export default withResponsiveTable(HistoryTable, 300, 450);
