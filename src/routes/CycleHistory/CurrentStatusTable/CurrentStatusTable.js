import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import globalCss from '../../../css/global';

const CheckboxTable = checkboxHOC(ReactTable);
const keyName = 'data_mart_name';

/**
 * Table columns
 */
const columns = [
  {
    Header: 'DATA_MART_NAME',
    accessor: 'data_mart_name',
    minWidth: 140
  },
  {
    Header: 'STATUS',
    accessor: 'data_mart_status_internal',
    width: 140
  },
  {
    Header: 'JOBS',
    accessor: 'job_count',
    width: 40,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'DONE',
    accessor: 'jobs_finished',
    width: 40,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'START_DTTM',
    accessor: 'data_mart_start_dttm',
    width: 110
  },
  {
    Header: 'END_DTTM',
    accessor: 'data_mart_end_dttm',
    width: 110
  },
  {
    Header: 'RUN_TIME',
    accessor: 'run_time_to_current_datamart_status',
    width: 70,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'TRANS_RATE',
    accessor: 'data_mart_trans_rate',
    width: 90,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  }
];

const SelectAllInputComponent = () => (<span />);

class CurrentStatusTable extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    dataTotals: PropTypes.object.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    selectedData: PropTypes.object.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.isFetching !== this.props.isFetching
      || nextProps.data !== this.props.data
      || nextProps.dataTotals !== this.props.dataTotals
      || nextProps.fetchingError !== this.props.fetchingError
      || nextProps.selectedData !== this.props.selectedData;
  }

  getTrProps = (state, row) => {
    if (!row || !this.isSelected(row.original[keyName])) {
      return {};
    }

    const color = globalCss.colors.rowHighLight;
    return {
      style: {
        backgroundColor: color
      }
    };
  };

  getLoadingText = (fetchingError) => {
    if (fetchingError) {
      return 'There was an error loading the ETL current status. Please refresh.';
    }

    return '';
  };

  toggleSelection = (selectKey, shift, row) => {
    const { selectedData, selectData, unselectData } = this.props;
    const key = row[keyName];

    // Check to see if the key exists
    if (objectHasOwnProperty(selectedData, key)) {
      unselectData(key, row);
    } else {
      // It does not exist so add it
      selectData(row);
    }
  };

  isSelected = key => objectHasOwnProperty(this.props.selectedData, key);

  render() {
    const {
      isFetching, data, dataTotals, fetchingError
    } = this.props;

    const defaultMinRows = data.length < 1 ? 5 : data.length;

    if (Object.keys(dataTotals).length > 0) {
      columns.forEach((column) => {
        column.Footer = (<span>{dataTotals[column.accessor]}</span>);
      });
    }

    return (
      <CheckboxTable
        data={data}
        columns={columns}
        showPaginationBottom={false}
        sortable={false}
        manual
        className="-striped status-table"
        loading={isFetching || fetchingError}
        loadingText={this.getLoadingText(fetchingError)}
        noDataText="ETL status not found."
        getTrProps={this.getTrProps}
        defaultPageSize={defaultMinRows}
        minRows={defaultMinRows}
        isSelected={this.isSelected}
        toggleSelection={this.toggleSelection}
        toggleAll={false}
        selectAll={false}
        selectType="checkbox"
        keyField={keyName}
        SelectAllInputComponent={SelectAllInputComponent}
      />
    );
  }
}

export default CurrentStatusTable;
