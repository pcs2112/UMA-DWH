import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const ReactTableRowExpander = ({ isExpanded }) => (
  <div className="centered-aligned">
    {isExpanded
      ? <Icon name="minus square outline" size="large" className="expander" />
      : <Icon name="plus square outline" size="large" className="expander" />}
  </div>
);

ReactTableRowExpander.propTypes = {
  isExpanded: PropTypes.bool
};

ReactTableRowExpander.defaultProps = {
  isExpanded: false
};

export default ReactTableRowExpander;
