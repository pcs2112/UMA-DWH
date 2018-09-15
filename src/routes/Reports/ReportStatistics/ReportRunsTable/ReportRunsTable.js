import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from 'components/WithResponsiveTable';

const keyName = 'id';

/**
 * Table columns
 */
const columns = [
  {
    Header: 'REPORT_NAME',
    accessor: 'report_name',
    width: 200
  },
  {
    Header: 'FROM_DTTM',
    accessor: 'from_dttm',
    width: 150
  },
  {
    Header: 'TO_DTTM',
    accessor: 'from_dttm',
    width: 150
  },
  {
    Header: 'STORED_PROCEDURE',
    accessor: 'stored_procedure',
    minWidth: 300
  },
  {
    Header: 'SOURCE_TABLE_NAME',
    accessor: 'source_table_name',
    width: 200
  },
  {
    Header: 'RANK',
    accessor: 'rank',
    width: 140,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
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
  }
];

class ReportRunsTable extends Component {
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
      return 'There was an error loading the Report runs. Please refresh.';
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
        noDataText={dataLoaded ? '0 Report runs found.' : ''}
        keyField={keyName}
        resizable={false}
      />
    );
  }
}

export default withResponsiveTable(ReportRunsTable, 320, 320);
