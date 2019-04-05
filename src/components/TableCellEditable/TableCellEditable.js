import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = { width: '100%' };

class TableCellEditable extends Component {
  static propTypes = {
    html: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.divRef.current.innerHTML;
  }

  handleOnChange = () => {
    const html = this.divRef.current.innerHTML;
    const { onChange } = this.props;
    if (onChange && html !== this.lastHtml) {
      onChange(html);
    }

    this.lastHtml = html;
  };

  handleKeyPress = (e) => {
    const keycode = e.charCode || e.keyCode;
    if (keycode === 13) {
      e.preventDefault();
      this.divRef.current.blur();
      this.handleOnChange();
    }
  };

  render() {
    const { html } = this.props;
    return React.createElement(
      'div',
      {
        ref: this.divRef,
        onKeyPress: this.handleKeyPress,
        suppressContentEditableWarning: true,
        contentEditable: true,
        dangerouslySetInnerHTML: { __html: html },
        style: styles
      }
    );
  }
}

export default TableCellEditable;
