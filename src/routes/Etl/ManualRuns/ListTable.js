import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from '../../../components/WithResponsiveTable';

const keyName = 'id';

/**
 * Table columns
 */
const columns = [
  {
    Header: 'DOMAIN',
    accessor: 'domain',
    width: 150
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    minWidth: 120
  },
  {
    Header: 'STORED_PROCEDURE',
    accessor: 'stored_procedure',
    minWidth: 200
  },
  {
    Header: 'FROM_DTTM',
    accessor: 'from_dttm',
    minWidth: 120
  },
  {
    Header: 'TO_DTTM',
    accessor: 'to_dttm',
    minWidth: 120
  },
];

class ListTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    onEdit: PropTypes.func.isRequired
  };

  onEdit = (e) => {
    e.preventDefault();
    this.props.onEdit(e.currentTarget.getAttribute('data-id'));
  };

  getActionsCell = row => (
    <div className="centered-aligned">
      <a
        href="/#"
        data-id={row.original.id}
        onClick={this.onEdit}
      >
        EDIT
      </a>
    </div>
  );

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the data. Please refresh.';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  getColumns = () => {
    const newColumns = [...columns];
    newColumns.push({
      Header: 'ACTIONS',
      Cell: this.getActionsCell,
      width: 110
    });

    return newColumns;
  };

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <ReactTable
        data={data}
        columns={this.getColumns()}
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
        noDataText={dataLoaded ? '0 records found.' : ''}
        keyField={keyName}
      />
    );
  }
}

export default withResponsiveTable(ListTable, 300, 590);
