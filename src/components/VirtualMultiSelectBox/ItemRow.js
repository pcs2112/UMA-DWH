import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.less';

const ItemRow = ({
  index,
  // isScrolling,
  style,
  labelKey,
  itemData,
  onItemClick,
  icon
}) => (
  <div
    role="presentation"
    className={styles.item}
    style={style}
    onClick={() => onItemClick(itemData, index)}
  >
    <span>{itemData && itemData[labelKey]}</span>
    <span className={styles.icon}>
      <i className={icon} aria-hidden="true" />
    </span>
  </div>
);

ItemRow.propTypes = {
  index: PropTypes.number,
  style: PropTypes.object,
  // isScrolling: PropTypes.bool,
  labelKey: PropTypes.string,
  itemData: PropTypes.object,
  onItemClick: PropTypes.func,
  icon: PropTypes.string
};

export default memo(ItemRow);
