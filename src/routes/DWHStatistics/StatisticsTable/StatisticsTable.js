import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import withResponsiveTable from 'components/WithResponsiveTable';
import globalCss from 'css/global';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';

const CheckboxTable = checkboxHOC(ReactTable);
const keyName = 'id';
const noTrProps = {};
const defaultExpanded = {};

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
    Header: 'STATUS',
    accessor: 'status',
    width: 80
  },
  {
    Header: 'RUN_TIME',
    accessor: 'run_time_hh_mm_ss_ms',
    width: 65,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'SCHEMA_FULL',
    accessor: 'schema_full',
    width: 300
  },
  {
    Header: 'TABLE_FULL',
    accessor: 'table_full',
    width: 500
  },
  {
    Header: 'SERVER',
    accessor: 'server',
    width: 120
  },
  {
    Header: 'DATABASE',
    accessor: 'database',
    width: 150
  },
  {
    Header: 'SCHEMA',
    accessor: 'schema',
    width: 100
  },
  {
    Header: 'TABLE',
    accessor: 'table',
    width: 220
  },
  {
    Header: 'STATISTICS_METHOD',
    accessor: 'statistics_method',
    width: 150
  },
  {
    Header: 'ERROR_PROCEDURE',
    accessor: 'error_procedure',
    width: 300
  },
  {
    Header: 'ERROR_MESSAGE',
    accessor: 'error_message',
    minWidth: 300
  }
];

const SelectAllInputComponent = () => (<span />);

class StatisticsTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    selectedData: PropTypes.object.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: defaultExpanded
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.tableHeight !== this.props.tableHeight
      || nextProps.isFetching !== this.props.isFetching
      || nextProps.dataLoaded !== this.props.dataLoaded
      || nextProps.data !== this.props.data
      || nextProps.fetchingError !== this.props.fetchingError
      || nextProps.selectedData !== this.props.selectedData
      || nextState.expanded !== this.state.expanded;
  }

  onExpanded = (newExpanded, index) => {
    const { expanded } = this.state;
    this.setState({
      expanded: {
        [index[0]]: !expanded[index[0]]
      }
    });
  };

  toggleSelection = (key, shift, row) => {
    const { selectedData, selectData, unselectData } = this.props;

    // Check to see if the key exists
    if (objectHasOwnProperty(selectedData, key)) {
      unselectData(key);
    } else {
      // It does not exist so add it
      selectData(key, row);
    }
  };

  isSelected = key => objectHasOwnProperty(this.props.selectedData, key);

  getTrProps = (state, row) => {
    if (!row) {
      return noTrProps;
    }

    let bgColor = 'none';
    let textColor = '#000';
    if (row.original.err > 0 || row.original.try_catch_err_id > 0) {
      bgColor = globalCss.colors.error;
      textColor = '#FFF';
    }

    if (bgColor === 'none') {
      return noTrProps;
    }

    return {
      style: {
        backgroundColor: bgColor,
        color: textColor
      }
    };
  };

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the Statistics. Please refresh.';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <CheckboxTable
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
        noDataText={dataLoaded ? '0 Statistics records found.' : ''}
        getTrProps={this.getTrProps}
        keyField={keyName}
        toggleSelection={this.toggleSelection}
        toggleAll={false}
        selectAll={false}
        selectType="checkbox"
        SelectAllInputComponent={SelectAllInputComponent}
        isSelected={this.isSelected}
        expanded={this.state.expanded}
        onExpandedChange={this.onExpanded}
      />
    );
  }
}

export default withResponsiveTable(StatisticsTable, 300, 360);
