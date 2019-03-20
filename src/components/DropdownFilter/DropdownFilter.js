import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { isEmpty } from 'javascript-utils/lib/utils';
import withDropdownFilter from '../WithDropdownFilter';

const getOptions = (placeholder, options) => {
  const optionsNormalized = options || [];

  if (isEmpty(placeholder)) {
    return optionsNormalized;
  }

  const newOptions = [{
    key: '-1',
    value: '',
    text: placeholder
  }];

  optionsNormalized.forEach((option) => {
    newOptions.push(option);
  });

  return newOptions;
};

const DropdownFilter = ({
  defaultValue, options, placeholder, className, disabled, onChange
}) => (
  <Dropdown
    fluid
    selectOnNavigation={false}
    selection
    name="false"
    options={getOptions(placeholder, options)}
    onChange={onChange}
    value={isEmpty(defaultValue) ? '' : defaultValue}
    placeholder={placeholder}
    className={className}
    disabled={disabled}
  />
);

DropdownFilter.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

DropdownFilter.defaultProps = {
  disabled: false
};

export default withDropdownFilter(DropdownFilter);
