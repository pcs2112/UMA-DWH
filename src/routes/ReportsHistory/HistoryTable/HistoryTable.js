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
    Header: 'REPORT_NAME',
    accessor: 'report_name',
    minWidth: 200
  },
  {
    Header: 'FROM_DTTM',
    accessor: 'from_dttm',
    width: 150
  },
  {
    Header: 'TO_DTTM',
    accessor: 'to_dttm',
    width: 150
  },
  {
    Header: 'REQUESTED_BY',
    accessor: 'report_request_user',
    width: 200
  },
  {
    Header: 'STORED_PROCEDURE',
    accessor: 'stored_procedure',
    width: 300
  },
  {
    Header: 'SOURCE_TABLE_NAME',
    accessor: 'source_table_name',
    width: 200
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
        textAlign: 'right',
        paddingRight: '1rem'
      }
    })
  },
  {
    Header: 'TRANS_SEC',
    accessor: 'trans_per_sec',
    width: 75,
    getProps: () => ({
      style: {
        textAlign: 'right',
        paddingRight: '1rem'
      }
    })
  },
  {
    Header: 'ERROR_MESSAGE',
    accessor: 'try_catch_err_message',
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
    if (row.original.try_catch_err_id > 0) {
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
      return 'There was an error loading the Report history. Please refresh.';
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
        noDataText={dataLoaded ? '0 Report history records found.' : ''}
        getTrProps={this.getTrProps}
        keyField={keyName}
      />
    );
  }
}

export default withResponsiveTable(HistoryTable, 300, 360);
