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
    Header: 'ACTIVE',
    accessor: 'active_flag',
    width: 50
  },
  {
    Header: 'CUBE_NAME',
    accessor: 'cube_name',
    minWidth: 150
  },
  {
    Header: 'VIEW_NAME',
    accessor: 'view_name',
    minWidth: 150
  },
  {
    Header: 'TABLE_NAME',
    accessor: 'table_name',
    minWidth: 150
  },
  {
    Header: 'MATERALIZE',
    accessor: 'materialize',
    width: 100
  },
  {
    Header: 'START_DATE',
    accessor: 'cube_date_start',
    width: 120
  },
  {
    Header: 'END_DATE',
    accessor: 'cube_date_end',
    width: 110
  },
  {
    Header: 'FACT_TBL_CT',
    accessor: 'fact_table_count',
    width: 100
  },
  {
    Header: 'DIM_TBL_CT',
    accessor: 'dimension_table_count',
    width: 100
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

  onEdit = (e) => {
    e.preventDefault();
    this.props.onEdit(parseInt(e.currentTarget.getAttribute('data-id'), 10));
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

export default withResponsiveTable(ListTable, 300, 560);
