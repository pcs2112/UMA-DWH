import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import withResponsiveTable from 'components/WithResponsiveTable';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';

const CheckboxTable = checkboxHOC(ReactTable);
const keyName = 'schema_table';
const defaultExpanded = {};

/**
 * Table columns
 */
const columns = [
  {
    Header: 'UPDATE_DTTM',
    accessor: '"last_update_dttm',
    width: 110
  },
  {
    Header: 'QUEUED_DTTM',
    accessor: '"queued_dttm',
    width: 110
  },
  {
    Header: 'SCHEMA_FULL',
    accessor: 'schema_table',
    minWidth: 500
  },
  {
    Header: 'SCHEMA',
    accessor: 'schema_name',
    width: 100
  },
  {
    Header: 'TABLE',
    accessor: 'table',
    width: 220
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
    Header: 'MAX_MODIFIED_CNT',
    accessor: 'max_modified_cnt',
    width: 110,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'MAX_SAMPLED',
    accessor: 'max_sampled',
    width: 110,
    getProps: () => ({
      style: {
        textAlign: 'right',
        paddingRight: '1rem'
      }
    })
  },
  {
    Header: 'MIN_MODIFIED_CNT',
    accessor: 'min_modified_cnt',
    width: 110,
    getProps: () => ({
      style: {
        textAlign: 'right',
        paddingRight: '1rem'
      }
    })
  },
  {
    Header: 'MIN_ROWS',
    accessor: 'min_rows',
    width: 110,
    getProps: () => ({
      style: {
        textAlign: 'right',
        paddingRight: '1rem'
      }
    })
  },
  {
    Header: 'MAX_SAMPLED',
    accessor: 'max_sampled',
    width: 110,
    getProps: () => ({
      style: {
        textAlign: 'right',
        paddingRight: '1rem'
      }
    })
  }
];

const SelectAllInputComponent = () => (<span />);

class ManagementTable extends Component {
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

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the Statistics management. Please refresh.';
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
        noDataText={dataLoaded ? '0 Statistics management records found.' : ''}
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

export default withResponsiveTable(ManagementTable, 230, 430);
