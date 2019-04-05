import * as React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import Grid from 'react-virtualized/dist/es/Grid';
import ScrollSync from 'react-virtualized/dist/es/ScrollSync';
import clsx from 'clsx';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import { Dimmer, Loader } from 'semantic-ui-react';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import { ROW_HEIGHT, OVERSCAN_COL_COUNT, OVERSCAN_ROW_COUNT } from '../../constants/reactVirtualized';
import styles from '../../css/react-virtualized.less';

class CheckboxVirtualTable extends React.PureComponent {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    containerHeight: PropTypes.number.isRequired,
    selectedData: PropTypes.object.isRequired,
    selectedDataCount: PropTypes.number.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    keyName: PropTypes.string.isRequired,
    onCellChange: PropTypes.func
  };

  tableWidth = 0;

  _renderLeftSideHeaderCell = ({
    key, style
  }) => (<div className={styles.HeaderCell} key={key} style={style} />);

  _renderHeaderCell = ({
    columnIndex, key, style
  }) => {
    if (columnIndex < 1) {
      return null;
    }

    const { columns } = this.props;

    return (
      <div className={styles.HeaderCell} key={key} style={style} contentEditable>
        {columns[columnIndex].label}
      </div>
    );
  };

  _getHeaderColumnWidth = ({ index }) => {
    const { columns } = this.props;
    if (index < columns.length - 1) {
      return this._getColumnWidth({ index });
    }

    let totalWidth = 0;
    columns.forEach((col) => {
      totalWidth += col.width;
    });

    return totalWidth <= this.tableWidth
      ? columns[index].width + (this.tableWidth - totalWidth) : columns[index].width;
  };

  _renderLeftSideCell = ({
    key, rowIndex, style
  }) => {
    const { keyName } = this.props;
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

    const { columns, onCellChange } = this.props;
    const column = columns[columnIndex];
    const rowClass = this._getRowColorClass(rowIndex);
    let classNames = clsx(rowClass, styles.Cell);
    const rowData = this._rowGetter(rowIndex);
    const value = rowData[columns[columnIndex].dataKey];

    if (objectHasOwnProperty(column, 'render')) {
      return (
        <div className={classNames} key={key} style={style}>
          {column.render(key, value, rowData, onCellChange)}
        </div>
      );
    }

    if (column.isNumeric) {
      classNames = clsx(classNames, styles.NumericCell);
    }

    return (
      <div className={classNames} key={key} style={style}>
        {value}
      </div>
    );
  };

  _getColumnWidth = ({ index }) => {
    const { columns } = this.props;
    if (index < columns.length - 1) {
      return columns[index].width;
    }

    let totalWidth = 0;
    columns.forEach((col) => {
      totalWidth += col.width;
    });

    return totalWidth <= this.tableWidth
      ? (columns[index].width - scrollbarSize()) + (this.tableWidth - totalWidth) : columns[index].width;
  };

  _getLeftSideColumnWidth = () => this.props.columns[0].width;

  _rowGetter = (rowIndex) => {
    const { data } = this.props;
    return data[rowIndex];
  };

  _getRowColorClass = (rowIndex) => {
    const { keyName } = this.props;
    const rowData = this._rowGetter(rowIndex);
    if (this._isSelected(rowData[keyName])) {
      return styles.HighlightedRow;
    }

    return (rowIndex % 2 === 0 ? styles.EvenRow : styles.OddRow);
  };

  _toggleSelection = (row) => {
    const {
      selectedData, selectData, unselectData, keyName
    } = this.props;
    const key = row[keyName];
    if (objectHasOwnProperty(selectedData, key)) {
      unselectData(key, row);
    } else {
      selectData(row);
    }
  };

  _isSelected = key => objectHasOwnProperty(this.props.selectedData, key);

  render() {
    const {
      containerHeight, isFetching, data, selectedDataCount, columns
    } = this.props;

    const columnCount = columns.length;
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
                height={ROW_HEIGHT}
                rowHeight={ROW_HEIGHT}
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
                top: ROW_HEIGHT
              }}
            >
              <Grid
                overscanColumnCount={OVERSCAN_COL_COUNT}
                overscanRowCount={OVERSCAN_ROW_COUNT}
                cellRenderer={this._renderLeftSideCell}
                columnWidth={this._getLeftSideColumnWidth}
                columnCount={1}
                className={styles.LeftSideGrid}
                height={containerHeight - scrollbarSize()}
                rowHeight={ROW_HEIGHT}
                rowCount={rowCount}
                scrollTop={scrollTop}
                width={this._getLeftSideColumnWidth()}
                selectedCount={selectedDataCount}
              />
            </div>
            <div className={styles.GridColumn}>
              <AutoSizer disableHeight>
                {({ width }) => {
                  this.tableWidth = width;
                  return (
                    <div>
                      <div
                        style={{
                          height: ROW_HEIGHT,
                          width: width - scrollbarSize()
                        }}
                      >
                        <Grid
                          className={styles.HeaderGrid}
                          columnWidth={this._getHeaderColumnWidth}
                          columnCount={columnCount}
                          height={ROW_HEIGHT}
                          overscanColumnCount={OVERSCAN_COL_COUNT}
                          cellRenderer={this._renderHeaderCell}
                          rowHeight={ROW_HEIGHT}
                          rowCount={1}
                          scrollLeft={scrollLeft}
                          width={width}
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
                          overscanColumnCount={OVERSCAN_COL_COUNT}
                          overscanRowCount={OVERSCAN_ROW_COUNT}
                          cellRenderer={this._renderBodyCell}
                          rowHeight={ROW_HEIGHT}
                          rowCount={rowCount}
                          width={width}
                          selectedCount={selectedDataCount}
                        />
                      </div>
                    </div>
                  );
                }}
              </AutoSizer>
            </div>
          </div>
        )}
      </ScrollSync>
    );
  }
}

export default CheckboxVirtualTable;
