import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer } from 'react-virtualized';
import ItemRow from './ItemRow';
import styles from './styles.less';

class VirtualMultiSelectBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterText: ''
    };
  }

  getFilteredOptions() {
    const {
      valueKey, labelKey, options, valueArray
    } = this.props;
    const { filterText } = this.state;
    return options
      .filter(
        item => valueArray.findIndex(value => value === item[valueKey || labelKey]) < 0
      )
      .filter(item =>
        item[labelKey]
          .toLocaleLowerCase()
          .includes(filterText.toLocaleLowerCase()));
  }

  handleAddClick = selectedItem => {
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd(selectedItem);
    }
  }

  handleRemoveClick = (selectedItem, index) => {
    const { onRemove } = this.props;
    if (onRemove) {
      onRemove(selectedItem, index);
    }
  }

  handleSelectAllClick = () => {
    const { onSelectAll } = this.props;
    if (onSelectAll) {
      onSelectAll([...this.getFilteredOptions()]);
    }
  }

  handleRemoveAllClick = () => {
    const { onRemoveAll } = this.props;
    if (onRemoveAll) {
      onRemoveAll();
    }
  }

  handleFilterChange = event => {
    this.setState({ filterText: event.target.value });
  }

  getSelectedRow = index => {
    const {
      valueKey, labelKey, options, valueArray
    } = this.props;
    return options.find(
      item => item[valueKey || labelKey] === valueArray[index]
    );
  }

  render() {
    const {
      labelKey,
      addAllLabel,
      onSelectAll,
      removeAllLabel,
      searchPlaceHolder,
      selectedLabel,
      boxHeight,
      valueArray
    } = this.props;
    const { filterText } = this.state;
    const availableData = this.getFilteredOptions();
    return (
      <div className={styles['multi-select']}>
        <div className={styles['available-list']}>
          <div className={styles.header}>
            <input
              type="text"
              className={styles.input}
              value={filterText}
              onChange={this.handleFilterChange}
              placeholder={searchPlaceHolder}
            />
            {onSelectAll && <button type="button" onClick={this.handleSelectAllClick}>{addAllLabel}</button>}
          </div>
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                className={styles['list-container']}
                height={boxHeight}
                rowCount={availableData.length}
                rowHeight={25}
                width={width}
                rowRenderer={props => (
                  <ItemRow
                    key={props.key}
                    itemData={availableData[props.index]}
                    labelKey={labelKey}
                    onItemClick={this.handleAddClick}
                    icon="plus icon"
                    {...props}
                  />
                )}
              />
            )}
          </AutoSizer>
        </div>

        <div className={styles['selected-list']}>
          <div className={styles.header}>
            <div className={styles.count}>
              <span>
                {valueArray.length} {selectedLabel}
              </span>
            </div>
            <button type="button" onClick={this.handleRemoveAllClick}>
              {removeAllLabel}
            </button>
          </div>
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                className={styles['list-container']}
                height={boxHeight}
                rowCount={valueArray.length}
                rowHeight={25}
                width={width}
                rowRenderer={props => (
                  <ItemRow
                    key={props.key}
                    itemData={this.getSelectedRow(props.index)}
                    labelKey={labelKey}
                    onItemClick={this.handleRemoveClick}
                    icon="minus icon"
                    {...props}
                  />
                )}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}

VirtualMultiSelectBox.propTypes = {
  options: PropTypes.array.isRequired,
  id: PropTypes.string,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  addAllLabel: PropTypes.string,
  removeAllLabel: PropTypes.string,
  valueArray: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func,
  onRemoveAll: PropTypes.func.isRequired,
  searchPlaceHolder: PropTypes.string,
  selectedLabel: PropTypes.string,
  boxHeight: PropTypes.number
};

VirtualMultiSelectBox.defaultProps = {
  addAllLabel: 'Add All',
  removeAllLabel: 'Remove All',
  searchPlaceHolder: 'Search...',
  selectedLabel: 'Items selected',
  boxHeight: 173,
  valueArray: []
};

export default VirtualMultiSelectBox;
