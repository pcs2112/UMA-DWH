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
    Header: 'DATE',
    accessor: 'error_date',
    width: 150
  },
  {
    Header: 'PROCEDURE',
    accessor: 'error_procedure',
    width: 300
  },
  {
    Header: 'LINE',
    accessor: 'error_line',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'NUMBER',
    accessor: 'error_number',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'SEVERITY',
    accessor: 'error_severity',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'STATE',
    accessor: 'error_state',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'USER',
    accessor: 'error_user',
    width: 100,
    getProps: () => ({
      style: {
        textAlign: 'center'
      }
    })
  },
  {
    Header: 'PROCEDURE_LOGGING_ERROR',
    accessor: 'procedure_logging_error',
    minWidth: 500
  },
  {
    Header: 'PROCEDURE_RUNTIME',
    accessor: 'procedure_runtime',
    width: 150,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'ERROR_MESSAGE',
    accessor: 'error_message',
    minWidth: 500
  }
];

class ErrorsTable extends Component {
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
      return 'There was an error loading the DWH errors. Please refresh.';
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
        noDataText={dataLoaded ? '0 DWH error records found.' : ''}
        getTrProps={this.getTrProps}
        keyField={keyName}
      />
    );
  }
}

export default withResponsiveTable(ErrorsTable, 300, 360);
