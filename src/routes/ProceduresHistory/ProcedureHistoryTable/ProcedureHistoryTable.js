import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from 'components/WithResponsiveTable';

const keyName = 'id';

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
    width: 200
  },
  {
    Header: 'STORED_PROCEDURE',
    accessor: 'procedure_name',
    width: 300
  },
  {
    Header: 'ETL_FROM_DTTM',
    accessor: 'etl_from_dttm',
    width: 100
  },
  {
    Header: 'ETL_TO_DTTM',
    accessor: 'etl_to_dttm',
    width: 100
  },
  {
    Header: 'INS',
    accessor: 'insert_count',
    width: 35,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'UPT',
    accessor: 'update_count',
    width: 35,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'DEL',
    accessor: 'delete_count',
    width: 35,
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
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
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
    return nextProps.isFetching !== this.props.isFetching
      || nextProps.dataLoaded !== this.props.dataLoaded
      || nextProps.data !== this.props.data
      || nextProps.fetchingError !== this.props.fetchingError;
  }

  componentDidUpdate() {
    console.log('ProcedureHistoryTable::componentDidUpdate');
  }

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
        showPaginationBottom={false}
        sortable={false}
        className="-striped"
        loading={isFetching || fetchingError}
        loadingText={this.getLoadingText()}
        noDataText={dataLoaded ? '0 ETL procedure history records found.' : ''}
        keyField={keyName}
        resizable={false}
      />
    );
  }
}

export default withResponsiveTable(ProcedureHistoryTable, 530, 220);
