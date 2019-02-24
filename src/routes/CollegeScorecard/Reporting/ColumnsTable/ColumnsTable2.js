import 'react-virtualized/styles.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import Table, { Column } from 'react-virtualized/dist/es/Table';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import withResponsiveTable from 'components/WithResponsiveTable';

const keyName = 'dictionary_entry_id';
const defaultExpanded = {};

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

  toggleSelection = (row) => {
    const { selectedData, selectData, unselectData } = this.props;
    const key = row[keyName];
    if (objectHasOwnProperty(selectedData, key)) {
      unselectData(key);
    } else {
      selectData(key, row);
    }
  };

  isSelected = key => objectHasOwnProperty(this.props.selectedData, key);

  rowGetter = ({ index }) => this.props.data[index];

  _rowClassName = ({ index }) => {
    if (index < 0) {
      return 'rvt-header-row';
    }

    return index % 2 === 0 ? 'rvt-even-row' : 'rvt-odd-row';
  };

  _noRowsRenderer = () => <div className="rvt-empty">No rows</div>;

  _checkboxCellRenderer = ({ rowData }) => (
    <input
      type="checkbox"
      className="checkbox"
      checked={this.isSelected(rowData[keyName])}
      onChange={() => this.toggleSelection(rowData)}
    />
  );

  render() {
    const {
      tableHeight, data
    } = this.props;
    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            ref={(ref) => { this.Table = ref; }}
            headerClassName="rtv-header-col"
            headerHeight={22}
            height={tableHeight}
            noRowsRenderer={this._noRowsRenderer}
            overscanRowCount={10}
            rowClassName={this._rowClassName}
            rowHeight={18}
            rowGetter={this.rowGetter}
            rowCount={data.length}
            width={width}
          >
            <Column
              dataKey="id"
              label=""
              width={25}
              cellRenderer={this._checkboxCellRenderer}
            />
            <Column
              dataKey="column_name"
              label="COLUMN_NAME"
              width={200}
            />
            <Column
              dataKey="row_count"
              label="POPULATED"
              width={100}
            />
            <Column
              dataKey="per_pop"
              label="% POPULATED"
              width={100}
            />
            <Column
              dataKey="entry_data_type"
              label="DATA_TYPE"
              width={120}
            />
            <Column
              dataKey="entry_name"
              label="DESCRIPTION"
              width={450}
            />
            <Column
              dataKey="entry_description"
              label="LONG DESCRIPTION"
              flexGrow={1}
              width={400}
            />
          </Table>
        )}
      </AutoSizer>
    );
  }
}

export default withResponsiveTable(ColumnsTable, 320, 280);
