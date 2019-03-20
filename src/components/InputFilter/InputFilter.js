import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import withInputFilter from '../WithInputFilter';

const InputFilter = ({ defaultValue, placeholder, onChange }) => (
  <Input
    icon="search"
    placeholder={placeholder}
    onChange={onChange}
    defaultValue={defaultValue}
  />
);

InputFilter.propTypes = {
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withInputFilter(InputFilter);
