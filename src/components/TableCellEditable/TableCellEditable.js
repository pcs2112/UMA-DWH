import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = { width: '100%' };

class TableCellEditable extends Component {
  static propTypes = {
    html: PropTypes.string,
    prefixText: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    prefixText: '* :'
  };

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.divRef.current.innerHTML;
  }

  handleKeyPress = (e) => {
    let html = this.divRef.current.innerHTML.trim();
    const keycode = e.charCode || e.keyCode;

    if (keycode === 13) {
      e.preventDefault();

      this.divRef.current.blur();

      const { onChange, prefixText } = this.props;
      if (onChange && html !== this.lastHtml) {
        if (prefixText) {
          if (!html.startsWith(prefixText)) {
            this.divRef.current.innerHTML = `${prefixText} ${html}`;
          }

          html = html.replace(prefixText, '');
        }

        onChange(html);
      }
    }

    this.lastHtml = html;
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
