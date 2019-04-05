import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ContentEditable extends Component {
  static propTypes = {
    html: PropTypes.string,
    classNames: PropTypes.string,
    styles: PropTypes.object,
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

  render() {
    const { html, classNames, styles } = this.props;
    return (
      <div
        ref={this.divRef}
        onInput={this.emitChange}
        onBlur={this.emitChange}
        contentEditable
        dangerouslySetInnerHTML={{ __html: html }}
        className={classNames}
        style={styles}
      />
    );
  }
}

export default ContentEditable;
