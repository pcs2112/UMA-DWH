import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import { Icon } from 'semantic-ui-react';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import globalCss from 'css/global';
import withResponsiveTable from 'components/WithResponsiveTable';
import withAsyncPolling from 'components/WithAsyncPolling';
import { DetailsDiv, DetailsColDiv, DetailsLabel, DetailsRow } from '../css';

const CheckboxTable = checkboxHOC(ReactTable);
const keyName = 'calling_proc';
const noTrProps = {};
const defaultExpanded = {};

/**
 * Table columns
 */
const columns = [
  {
    expander: true,
    Expander: ({ isExpanded }) => ( // eslint-disable-line
      <div className="centered-aligned">
        {isExpanded
          ? <Icon name="minus square outline" size="large" className="expander" />
          : <Icon name="plus square outline" size="large" className="expander" />}
      </div>
    ),
    width: 30
  },
  {
    Header: 'START_DTTM',
    accessor: 'start_dttm',
    width: 110
  },
  {
    Header: 'END_DTTM',
    accessor: 'end_dttm',
    width: 110
  },
  {
    Header: 'STATUS',
    accessor: 'table_status',
    width: 80
  },
  {
    Header: 'DATA_MART_NAME',
    accessor: 'data_mart_name',
    width: 120
  },
  {
    Header: 'SOURCE_SERVER_NAME',
    accessor: 'source_server_name',
    width: 140
  },
  {
    Header: 'DB_NAME',
    accessor: 'source_db_name',
    width: 70
  },
  {
    Header: 'SCHEMA_TABLE_NAME',
    Cell: row => `${row.original.source_schema_name}.${row.original.source_table_name}`,
    width: 200
  },
  {
    Header: 'TARGET_SCHEMA_TABLE_NAME',
    Cell: row => `${row.original.target_schema_name}.${row.original.target_table_name}`,
    minWidth: 250
  },
  {
    Header: 'STORED_PROCEDURE',
    accessor: 'calling_proc',
    minWidth: 300
  },
  {
    Header: 'INS',
    accessor: 'insert_cnt',
    width: 35,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'UPT',
    accessor: 'update_cnt',
    width: 35,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'DEL',
    accessor: 'delete_cnt',
    width: 35,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'RUN_TIME',
    accessor: 'run_time_sec',
    width: 70,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'TRANS_PER_SEC',
    accessor: 'trans_per_sec',
    width: 90,
    getProps: () => ({
      style: {
        textAlign: 'right',
        paddingRight: '1rem'
      }
    })
  }
];

const SelectAllInputComponent = () => (<span />);

const RowDetails = ({ row }) => { // eslint-disable-line
  const keys = Object.keys(row.original);
  const tableWidth = document.getElementById('cycle-history-tbl').offsetWidth;
  const width = tableWidth < 1000 ? 1000 : tableWidth;
  return (
    <DetailsDiv
      style={{
        width
      }}
    >
      <DetailsColDiv>
        {keys.slice(0, 10).map(key =>
          <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{row.original[key]}</DetailsRow>)
        }
      </DetailsColDiv>
      <DetailsColDiv>
        {keys.slice(10, 20).map(key =>
          <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{row.original[key]}</DetailsRow>)
        }
      </DetailsColDiv>
      <DetailsColDiv>
        {keys.slice(20, 28).map(key =>
          <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{row.original[key]}</DetailsRow>)
        }
      </DetailsColDiv>
    </DetailsDiv>
  );
};

class CycleHistoryTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    selectedData: PropTypes.object.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    dataMartsSelectedCount: PropTypes.number.isRequired
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

  componentDidUpdate(prevProps) {
    if (this.props.dataMartsSelectedCount !== prevProps.dataMartsSelectedCount) {
      this.scrollTop();
    }
  }

  onExpanded = (newExpanded, index) => {
    this.setState({
      expanded: {
        [index[0]]: !this.state.expanded[index[0]]
      }
    });
  };

  getTrProps = (state, row) => {
    if (!row) {
      return noTrProps;
    }

    let color = 'none';
    if (row.original.err_num > 0) {
      color = globalCss.colors.error;
    } else if (row.original.table_status === 'RUNNING') {
      color = globalCss.colors.success;
    } else if (row.original.table_status === 'NOT STARTED') {
      color = globalCss.colors[row.original.cycle_group > 0 ? 'warning' : 'paleGreen'];
    } else if (this.isSelected(row.original[keyName])) {
      color = globalCss.colors.rowHighLight;
    }

    if (color === 'none') {
      return noTrProps;
    }

    return {
      style: {
        backgroundColor: color
      }
    };
  };

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the ETL history. Please refresh';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  scrollTop = () => {
    document.getElementById('cycle-history-tbl').getElementsByClassName('rt-tbody')[0].scrollTop = 0;
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

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <div id="cycle-history-tbl">
        <CheckboxTable
          data={data}
          columns={columns}
          style={{
            height: `${tableHeight}px`
          }}
          showPaginationBottom={false}
          sortable={false}
          manual
          minRows={50}
          className="-striped"
          loading={isFetching || fetchingError}
          loadingText={this.getLoadingText()}
          noDataText={dataLoaded ? '0 ETL history records found.' : ''}
          getTrProps={this.getTrProps}
          isSelected={this.isSelected}
          toggleSelection={this.toggleSelection}
          toggleAll={false}
          selectAll={false}
          selectType="checkbox"
          keyField={keyName}
          SelectAllInputComponent={SelectAllInputComponent}
          SubComponent={row => <RowDetails row={row} />}
          expanded={this.state.expanded}
          onExpandedChange={this.onExpanded}
          resizable={false}
        />
      </div>
    );
  }
}

export default withAsyncPolling(withResponsiveTable(CycleHistoryTable, 320, 440));
