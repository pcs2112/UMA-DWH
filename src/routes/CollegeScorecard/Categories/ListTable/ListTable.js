import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from '../../../../components/WithResponsiveTable';

const keyName = 'id';

/**
 * Table columns
 */
const columns = [
  {
    Header: 'CATEGORY_NAME',
    accessor: 'category_name',
    width: 300
  },
  {
    Header: 'DESCRIPTION',
    accessor: 'description',
    width: 350
  },
  {
    Header: 'CSV_FILE',
    accessor: 'csv_file',
    width: 250
  },
  {
    Header: 'WHERE_TABLE',
    accessor: 'where_unit_id_table',
    width: 250
  },
  {
    Header: 'FORMULA',
    accessor: 'formula',
    minWidth: 300
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

  shouldComponentUpdate(nextProps) {
    return nextProps.tableHeight !== this.props.tableHeight
      || nextProps.isFetching !== this.props.isFetching
      || nextProps.dataLoaded !== this.props.dataLoaded
      || nextProps.data !== this.props.data
      || nextProps.fetchingError !== this.props.fetchingError;
  }

  onEdit = (e) => {
    e.preventDefault();
    this.props.onEdit(parseInt(e.currentTarget.getAttribute('data-id'), 10));
  };

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the list. Please refresh';
    }

    return dataLoaded ? '' : 'Loading...';
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

  getColumns = () => {
    const newColumns = [...columns];
    newColumns.push({
      Header: 'ACTIONS',
      Cell: this.getActionsCell
    });

    return newColumns;
  };

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <div id="cs-categories-tbl">
        <ReactTable
          data={data}
          columns={this.getColumns()}
          style={{
            height: `${tableHeight}px`
          }}
          showPaginationBottom={false}
          sortable={false}
          manual
          minRows={100}
          className="-striped"
          loading={isFetching || fetchingError}
          loadingText={this.getLoadingText()}
          noDataText={dataLoaded ? '0 records found.' : ''}
          getTrProps={this.getTrProps}
          keyField={keyName}
        />
      </div>
    );
  }
}

export default withResponsiveTable(ListTable, 320, 300);
