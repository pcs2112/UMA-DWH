import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import withFilterInput from '../WithFilterInput';

const FilterInput = ({ defaultValue, placeholder, onChange }) => (
  <Input
    icon="search"
    placeholder={placeholder}
    onChange={onChange}
    defaultValue={defaultValue}
  />
);

FilterInput.propTypes = {
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withFilterInput(FilterInput);
