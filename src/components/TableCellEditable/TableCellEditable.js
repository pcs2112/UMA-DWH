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

  handleKeyPress = (e) => {
    const html = this.divRef.current.innerHTML;
    const keycode = e.charCode || e.keyCode;

    if (keycode === 13) {
      e.preventDefault();

      this.divRef.current.blur();


      const { onChange } = this.props;
      if (onChange && html !== this.lastHtml) {
        onChange(html.trim());
      }
    }

    this.lastHtml = html.trim();
  };

  render() {
    const { html } = this.props;
    return React.createElement(
      'div',
      {
        ref: this.divRef,
        onKeyPress: this.handleKeyPress,
        contentEditable: true,
        dangerouslySetInnerHTML: { __html: html },
        style: styles
      }
    );
  }
}

export default TableCellEditable;
