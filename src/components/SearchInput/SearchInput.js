import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import withSearchInput from '../WithSearchInput';

const SearchInput = ({ defaultValue, placeholder, onChange }) => (
  <Input
    icon="search"
    placeholder={placeholder}
    onChange={onChange}
    defaultValue={defaultValue}
  />
);

SearchInput.propTypes = {
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withSearchInput(SearchInput);
