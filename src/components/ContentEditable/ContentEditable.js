import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ContentEditable extends Component {
  static propTypes = {
    html: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.getDOMNode().innerHTML;
  }

  emitChange = () => {
    const html = this.getDOMNode().innerHTML;
    const { onChange } = this.props;
    if (onChange && html !== this.lastHtml) {
      onChange({
        target: {
          value: html
        }
      });
    }

    this.lastHtml = html;
  };

  render() {
    const { html } = this.props;
    return (
      <div
        onInput={this.emitChange}
        onBlur={this.emitChange}
        contentEditable
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}

export default ContentEditable;
