import * as React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import Grid from 'react-virtualized/dist/es/Grid';
import ScrollSync from 'react-virtualized/dist/es/ScrollSync';
import clsx from 'clsx';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import { Dimmer, Loader } from 'semantic-ui-react';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import withResponsiveContainer from '../../../../components/WithResponsiveContainer';
import styles from './styles.less';

const keyName = 'dictionary_entry_id';
const columns = [
  {
    width: 25,
    label: ''
  },
  {
    dataKey: 'column_name',
    width: 200,
    label: 'COLUMN_NAME'
  },
  {
    dataKey: 'row_count',
    width: 100,
    label: 'POPULATED'
  },
  {
    dataKey: 'per_pop',
    width: 100,
    label: '% POPULATED'
  },
  {
    dataKey: 'entry_data_type',
    width: 120,
    label: 'DATA_TYPE'
  },
  {
    dataKey: 'entry_name',
    width: 500,
    label: 'DESCRIPTION'
  },
  {
    dataKey: 'entry_description',
    width: 2000,
    label: 'LONG DESCRIPTION'
  }
];

class ColumnsTable extends React.PureComponent {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    // dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    containerHeight: PropTypes.number.isRequired,
    selectedData: PropTypes.object.isRequired,
    selectedDataCount: PropTypes.number.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      columnCount: 7,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 22
    };

    this._renderBodyCell = this._renderBodyCell.bind(this);
    this._renderHeaderCell = this._renderHeaderCell.bind(this);
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
  }

  _renderLeftSideHeaderCell = ({
    key, style
  }) => (<div className={styles.HeaderCell} key={key} style={style} />);

  _renderHeaderCell = ({
    columnIndex, key, style
  }) => {
    if (columnIndex < 1) {
      return null;
    }

    return (
      <div className={styles.HeaderCell} key={key} style={style}>
        {columns[columnIndex].label}
      </div>
    );
  };

  _renderLeftSideCell = ({
    key, rowIndex, style
  }) => {
    const rowData = this._rowGetter(rowIndex);
    const rowClass = this._getRowColorClass(rowIndex);
    const classNames = clsx(rowClass, styles.LeftCell);
    return (
      <div className={classNames} key={key} style={style}>
        <input
          type="checkbox"
          className="checkbox"
          checked={this._isSelected(rowData[keyName])}
          onChange={() => this._toggleSelection(rowData)}
        />
      </div>
    );
  };

  _renderBodyCell = ({
    columnIndex, key, rowIndex, style
  }) => {
    if (columnIndex < 1) {
      return null;
    }

    const rowClass = this._getRowColorClass(rowIndex);
    const classNames = clsx(rowClass, styles.Cell);
    const rowData = this._rowGetter(rowIndex);
    const value = rowData[columns[columnIndex].dataKey];

    return (
      <div className={classNames} key={key} style={style}>
        {value}
      </div>
    );
  };

  _getColumnWidth = ({ index }) => columns[index].width;

  _getLeftSideColumnWidth = () => columns[0].width;

  _rowGetter = (rowIndex) => {
    const { data } = this.props;
    return data[rowIndex];
  };

  _getRowColorClass = rowIndex => (rowIndex % 2 === 0 ? styles.EvenRow : styles.OddRow);

  _toggleSelection = (row) => {
    const { selectedData, selectData, unselectData } = this.props;
    const key = row[keyName];
    if (objectHasOwnProperty(selectedData, key)) {
      unselectData(key);
    } else {
      selectData(key, row);
    }
  };

  _isSelected = key => objectHasOwnProperty(this.props.selectedData, key);

  render() {
    const {
      containerHeight, isFetching, data, selectedDataCount
    } = this.props;
    const {
      columnCount,
      overscanColumnCount,
      overscanRowCount,
      rowHeight
    } = this.state;

    const rowCount = data.length;

    return (
      <ScrollSync>
        {({
          onScroll,
          scrollLeft,
          scrollTop
        }) => (
          <div className={styles.GridRow}>
            <Dimmer active={isFetching} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <div
              className={styles.LeftSideGridContainer}
              style={{
                position: 'absolute',
                left: 0,
                top: 0
              }}
            >
              <Grid
                cellRenderer={this._renderLeftSideHeaderCell}
                className={styles.HeaderGrid}
                width={this._getLeftSideColumnWidth()}
                height={rowHeight}
                rowHeight={rowHeight}
                columnWidth={this._getLeftSideColumnWidth}
                rowCount={1}
                columnCount={1}
              />
            </div>
            <div
              className={styles.LeftSideGridContainer}
              style={{
                position: 'absolute',
                left: 0,
                top: rowHeight
              }}
            >
              <Grid
                overscanColumnCount={overscanColumnCount}
                overscanRowCount={overscanRowCount}
                cellRenderer={this._renderLeftSideCell}
                columnWidth={this._getLeftSideColumnWidth}
                columnCount={1}
                className={styles.LeftSideGrid}
                height={containerHeight - scrollbarSize()}
                rowHeight={rowHeight}
                rowCount={rowCount}
                scrollTop={scrollTop}
                width={this._getLeftSideColumnWidth()}
                selectedCount={selectedDataCount}
              />
            </div>
            <div className={styles.GridColumn}>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <div>
                    <div
                      style={{
                        height: rowHeight,
                        width: width - scrollbarSize()
                      }}
                    >
                      <Grid
                        className={styles.HeaderGrid}
                        columnWidth={this._getColumnWidth}
                        columnCount={columnCount}
                        height={rowHeight}
                        overscanColumnCount={overscanColumnCount}
                        cellRenderer={this._renderHeaderCell}
                        rowHeight={rowHeight}
                        rowCount={1}
                        scrollLeft={scrollLeft}
                        width={width - scrollbarSize()}
                      />
                    </div>
                    <div
                      style={{
                        containerHeight,
                        width
                      }}
                    >
                      <Grid
                        className={styles.BodyGrid}
                        columnWidth={this._getColumnWidth}
                        columnCount={columnCount}
                        height={containerHeight}
                        onScroll={onScroll}
                        overscanColumnCount={overscanColumnCount}
                        overscanRowCount={overscanRowCount}
                        cellRenderer={this._renderBodyCell}
                        rowHeight={rowHeight}
                        rowCount={rowCount}
                        width={width}
                      />
                    </div>
                  </div>
                )}
              </AutoSizer>
            </div>
          </div>
        )}
      </ScrollSync>
    );
  }
}

export default withResponsiveContainer(ColumnsTable, 320, 300);
