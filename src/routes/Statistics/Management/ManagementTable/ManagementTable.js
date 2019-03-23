import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import withResponsiveTable from '../../../../components/WithResponsiveTable';
import { scrollTableToTop } from '../../../../helpers/utils';
import globalCss from '../../../../css/global';

const CheckboxTable = checkboxHOC(ReactTable);
const keyName = 'schema_table';
const defaultExpanded = {};
const noTrProps = {};

/**
 * Table columns
 */
const columns = [
  {
    Header: 'LAST UPDATE DTTM',
    accessor: 'last_update_dttm',
    width: 150
  },
  {
    Header: 'QUEUED DTTM',
    accessor: 'queued_dttm',
    width: 150
  },
  {
    Header: 'LAST RECORD RUNTIME',
    accessor: 'last_recorded_runtime',
    width: 150
  },
  {
    Header: 'LAST RECORD DTTM',
    accessor: 'last_recorded_dttm',
    width: 150
  },
  {
    Header: 'SCHEMA.TABLE',
    accessor: 'schema_table',
    minWidth: 500
  },
  {
    Header: 'SCHEMA',
    accessor: 'schema',
    width: 150
  },
  {
    Header: 'TABLE',
    accessor: 'table',
    width: 350
  },
  {
    Header: 'MAX MODIFIED CNT',
    accessor: 'max_modified_cnt',
    width: 140,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'MAX SAMPLED',
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
    Header: 'MIN MODIFIED CNT',
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
    Header: 'MIN ROWS',
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
    Header: 'MAX SAMPLED',
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
    isQueuingStats: PropTypes.bool.isRequired
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
      || nextProps.isQueuingStats !== this.props.isQueuingStats
      || nextState.expanded !== this.state.expanded;
  }

  componentDidUpdate(prevProps) {
    if (this.props.isQueuingStats !== prevProps.isQueuingStats) {
      scrollTableToTop('statistics-management-tbl');
    }
  }

  onExpanded = (newExpanded, index) => {
    const { expanded } = this.state;
    this.setState({
      expanded: {
        [index[0]]: !expanded[index[0]]
      }
    });
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

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the Statistics management. Please refresh.';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  getTrProps = (state, row) => {
    if (!row) {
      return noTrProps;
    }

    let bgColor = 'none';
    const textColor = '#000';
    if (row.original.queued_dttm) {
      bgColor = globalCss.colors.paleGreen;
    } else if (this.isSelected(row.original[keyName])) {
      bgColor = globalCss.colors.rowHighLight;
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

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <div id="statistics-management-tbl">
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
          getTrProps={this.getTrProps}
          isSelected={this.isSelected}
          expanded={this.state.expanded}
          onExpandedChange={this.onExpanded}
        />
      </div>
    );
  }
}

export default withResponsiveTable(ManagementTable, 230, 430);
