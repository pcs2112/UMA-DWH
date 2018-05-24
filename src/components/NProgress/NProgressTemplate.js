import React from 'react';
import PropTypes from 'prop-types';
import { barStyles, pegStyles } from './css';

const NProgressTemplate = ({ color }) => (
  <div
    className="bar"
    role="bar" // eslint-disable-line
    style={{
      ...barStyles,
      background: color
    }}
  >
    <div
      className="peg"
      style={{
        ...pegStyles,
        boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`
      }}
    />
  </div>
);

NProgressTemplate.propTypes = {
  color: PropTypes.string.isRequired
};

export default NProgressTemplate;
