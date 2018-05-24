import PropTypes from 'prop-types';

const inputProps = {
  checked: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onDrop: PropTypes.func,
  onDragStart: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.any
};

export const fieldProps = {
  input: PropTypes.shape(inputProps),
  meta: PropTypes.shape({
    error: PropTypes.any,
    touched: PropTypes.bool
  }),
  required: PropTypes.bool,
  width: PropTypes.string,
  label: PropTypes.string,
  inline: PropTypes.bool,
  defaultChecked: PropTypes.bool
};

export const optionsFieldProps = {
  ...fieldProps,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string
  }))
};
