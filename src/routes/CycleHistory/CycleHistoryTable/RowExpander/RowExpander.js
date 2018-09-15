import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const RowExpander = ({ isExpanded }) => (
  <div className="centered-aligned">
    {isExpanded
      ? <Icon name="minus square outline" size="large" className="expander" />
      : <Icon name="plus square outline" size="large" className="expander" />}
  </div>
);

RowExpander.propTypes = {
  isExpanded: PropTypes.bool.isRequired
};

export default RowExpander;
