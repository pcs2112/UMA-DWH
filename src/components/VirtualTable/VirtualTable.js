import * as React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import Grid from 'react-virtualized/dist/es/Grid';
import ScrollSync from 'react-virtualized/dist/es/ScrollSync';
import clsx from 'clsx';
import scrollbarSize from 'dom-helpers/scrollbarSize';
import { Dimmer, Loader } from 'semantic-ui-react';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import { ROW_HEIGHT, OVERSCAN_COL_COUNT, OVERSCAN_ROW_COUNT } from '../../constants/reactVirtualized';
import styles from '../../css/react-virtualized.less';

class VirtualTable extends React.PureComponent {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    containerHeight: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    // keyName: PropTypes.string.isRequired
  };

  tableWidth = 0;

  _renderHeaderCell = ({
    columnIndex, key, style
  }) => {
    const { columns } = this.props;

    return (
      <div className={styles.HeaderCell} key={key} style={style}>
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

  _renderBodyCell = ({
    columnIndex, key, rowIndex, style
  }) => {
    const { columns } = this.props;
    const column = columns[columnIndex];
    const rowClass = this._getRowColorClass(rowIndex);
    let classNames = clsx(rowClass, styles.Cell);
    const rowData = this._rowGetter(rowIndex);
    const value = rowData[columns[columnIndex].dataKey];

    if (objectHasOwnProperty(column, 'render')) {
      return column.render(key, value, rowData, classNames, style);
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

  _rowGetter = (rowIndex) => {
    const { data } = this.props;
    return data[rowIndex];
  };

  _getRowColorClass = rowIndex => (rowIndex % 2 === 0 ? styles.EvenRow : styles.OddRow);

  render() {
    const {
      containerHeight, isFetching, data, columns
    } = this.props;

    const columnCount = columns.length;
    const rowCount = data.length;

    return (
      <ScrollSync>
        {({
          onScroll,
          scrollLeft
        }) => (
          <div className={styles.GridRow}>
            <Dimmer active={isFetching} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
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
                          isFetching={isFetching}
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
                          isFetching={isFetching}
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

export default VirtualTable;
