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
    accessor: 'active',
    width: 150
  },
  {
    Header: 'CUBE_NAME',
    accessor: 'cube_name',
    minWidth: 250
  },
  {
    Header: 'MULTI_FACT',
    accessor: 'multi_fact',
    width: 120
  },
  {
    Header: 'PRIMARY_FACT_TABLE',
    accessor: 'primary_fact_table',
    width: 150
  },
  {
    Header: 'SCHEDULE_TYPE',
    accessor: 'schedule_type',
    minWidth: 200
  },
  {
    Header: 'FACTS_DATE_RANGE',
    accessor: 'facts_date_range',
    minWidth: 150
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

export default withResponsiveTable(ListTable, 300, 400);
