import React from 'react';
import PropTypes from 'prop-types';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import globalCss from 'css/global';

const defaultStyles = {
  textAlign: 'center'
};

const PageHeader = ({ headerText, state }) => {
  let styles = defaultStyles;
  if (state && objectHasOwnProperty(globalCss.colors, state)) {
    styles = {
      ...defaultStyles,
      color: globalCss.colors[state]
    };
  }

  return (
    <h1
      style={styles}
    >
      {headerText}
    </h1>
  );
};

PageHeader.propTypes = {
  headerText: PropTypes.string.isRequired,
  state: PropTypes.string
};

export default PageHeader;
