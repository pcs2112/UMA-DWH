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
    Header: 'INSERT_DTTM',
    accessor: 'insert_dttm',
    width: 110
  },
  {
    Header: 'UPDATE_DTTM',
    accessor: 'update_dttm',
    width: 110
  },
  {
    Header: 'EMP_FIRST_NAME',
    accessor: 'employee_first_name'
  },
  {
    Header: 'EMP_LAST_NAME',
    accessor: 'employee_last_name'
  },
  {
    Header: 'EMP_EMAIL',
    accessor: 'employee_email'
  },
  {
    Header: 'EMP_PHONE',
    accessor: 'employee_phone'
  },
  {
    Header: 'EMP_CELL_PHONE',
    accessor: 'employee_cell_phone'
  }
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

  onEditUser = (e) => {
    e.preventDefault();
    this.props.onEdit(parseInt(e.currentTarget.getAttribute('data-id'), 10));
  };

  getUserCell = row => (
    <div className="centered-aligned">
      <a
        href="/#"
        data-id={row.original.id}
        onClick={this.onEditUser}
      >
        EDIT
      </a>
    </div>
  );

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the Admin console users. Please refresh.';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  getColumns = () => {
    const newColumns = [...columns];
    newColumns.push({
      Header: 'ACTIONS',
      Cell: this.getUserCell
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
        showPaginationBottom={false}
        sortable={false}
        className="-striped"
        loading={isFetching || fetchingError}
        loadingText={this.getLoadingText()}
        noDataText={dataLoaded ? '0 Admin console users found.' : ''}
        keyField={keyName}
      />
    );
  }
}

export default withResponsiveTable(ListTable, 510, 200);
