import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from 'components/WithResponsiveTable';
import globalCss from 'css/global';

const keyName = 'id';
const noTrProps = {};

/**
 * 'ENGINE_MESSAGE', 'ERROR_NUMBER'
 */

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
    Header: 'END_DTTM',
    accessor: 'end_dttm',
    width: 110
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    width: 80
  },
  {
    Header: 'DB_NAME',
    accessor: 'source_db',
    width: 70
  },
  {
    Header: 'SCHEMA_TABLE_NAME',
    accessor: 'source_table',
    width: 160
  },
  {
    Header: 'TARGET_SCHEMA_TABLE_NAME',
    Cell: row => `${row.original.target_schema}.${row.original.target_table}`,
    width: 300
  },
  {
    Header: 'STORED_PROCEDURE',
    accessor: 'procedure_name',
    width: 300
  },
  {
    Header: 'ETL_FROM_DTTM',
    accessor: 'etl_from_dttm',
    width: 150
  },
  {
    Header: 'ETL_TO_DTTM',
    accessor: 'etl_to_dttm',
    width: 150
  },
  {
    Header: 'INSERT',
    accessor: 'insert_count',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'UPDATE',
    accessor: 'update_count',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'DELETE',
    accessor: 'delete_count',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
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

class ProcedureHistoryTable extends Component {
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
    if (row.original.error_number > 0 || row.original.try_catch_err_id > 0) {
      bgColor = globalCss.colors.error;
      textColor = '#FFF';
    } else if (row.original.table_status === 'RUNNING') {
      bgColor = globalCss.colors.success;
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
      return 'There was an error loading the ETL procedure history. Please refresh.';
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
        noDataText={dataLoaded ? '0 ETL procedure history records found.' : ''}
        getTrProps={this.getTrProps}
        keyField={keyName}
      />
    );
  }
}

export default withResponsiveTable(ProcedureHistoryTable, 300, 360);
