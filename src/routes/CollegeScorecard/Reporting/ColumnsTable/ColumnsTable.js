import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import withResponsiveTable from 'components/WithResponsiveTable';

const CheckboxTable = checkboxHOC(ReactTable);
const keyName = 'column_name';
const defaultExpanded = {};

/**
 * Table columns
 */
const columns = [
  {
    Header: 'COLUMN_NAME',
    accessor: 'column_name',
    width: 200
  },
  {
    Header: 'POPULATED',
    accessor: 'row_count',
    width: 100,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: '% POPULATED',
    accessor: 'per_pop',
    width: 100,
    getProps: () => ({
      style: {
        textAlign: 'right'
      }
    })
  },
  {
    Header: 'DESCRIPTION',
    accessor: 'entry_data_type',
    width: 200
  },
  {
    Header: 'LONG DESCRIPTION',
    accessor: 'entry_description'
  }
];

const SelectAllInputComponent = () => (<span />);

class ColumnsTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    selectedData: PropTypes.object.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired
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

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the data. Please refresh.';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  toggleSelection = (selectKey, shift, row) => {
    const { selectedData, selectData, unselectData } = this.props;
    const key = row[keyName];
    if (objectHasOwnProperty(selectedData, key)) {
      unselectData(key);
    } else {
      selectData(key, row);
    }
  };

  isSelected = key => objectHasOwnProperty(this.props.selectedData, key);

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <div id="columns-tbl">
        <CheckboxTable
          data={data}
          columns={columns}
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
          isSelected={this.isSelected}
          toggleSelection={this.toggleSelection}
          toggleAll={false}
          selectAll={false}
          selectType="checkbox"
          keyField={keyName}
          SelectAllInputComponent={SelectAllInputComponent}
          expanded={this.state.expanded}
          onExpandedChange={this.onExpanded}
        />
      </div>
    );
  }
}

export default withResponsiveTable(ColumnsTable, 320, 200);
