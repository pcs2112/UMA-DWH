import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = { width: '100%' };

class ContentEditable extends Component {
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

  emitChange = () => {
    const html = this.divRef.current.innerHTML;
    const { onChange } = this.props;
    if (onChange && html !== this.lastHtml) {
      onChange(html);
    }

    this.lastHtml = html;
  };

  preventEnterKey = (e) => {
    const keycode = e.charCode || e.keyCode;
    if (keycode === 13) {
      e.preventDefault();
    }
  };

  render() {
    const { html } = this.props;
    return (
      <div // eslint-disable-line
        ref={this.divRef}
        onInput={this.emitChange}
        onBlur={this.emitChange}
        onKeyPress={this.preventEnterKey}
        contentEditable
        dangerouslySetInnerHTML={{ __html: html }}
        style={styles}
      />
    );
  }
}

export default ContentEditable;
