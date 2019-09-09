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
    Header: 'TABLE_NAME',
    accessor: 'table_name',
    width: 100
  },
  {
    Header: 'REP_ID',
    accessor: 'rep_id',
    width: 50
  },
  {
    Header: 'REP_USER_ID',
    accessor: 'rep_user_id',
    width: 150
  },
  {
    Header: 'DISPLAY_NAME',
    accessor: 'rep_display_name',
    width: 200
  },
  {
    Header: 'FIRST_NAME',
    accessor: 'rep_first_name',
    width: 100
  },
  {
    Header: 'LAST_NAME',
    accessor: 'rep_last_name',
    width: 100
  },
  {
    Header: 'NT_DOMAIN_USER',
    accessor: 'rep_nt_domain_user',
    width: 250
  },
  {
    Header: 'OUTBOUND_ANI',
    accessor: 'rep_outbound_ani',
    width: 110
  },
  {
    Header: 'DATE_ADDED',
    accessor: 'rep_date_added',
    width: 110
  },
  {
    Header: 'INSERT_DTTM',
    accessor: 'insert_dttm',
    width: 110
  },
  {
    Header: 'UPDATE_DTTM',
    accessor: 'update_dttm',
    width: 110
  }
];

class ListTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the data. Please refresh.';
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
        noDataText={dataLoaded ? '0 records found.' : ''}
        keyField={keyName}
      />
    );
  }
}

export default withResponsiveTable(ListTable, 510, 200);
