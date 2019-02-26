import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Dropdown, Form } from 'semantic-ui-react';
import { FILTERS_EXEC_DELAY } from '../../../constants/index';

class FilesDropdownFilter extends Component {
  static propTypes = {
    files: PropTypes.array.isRequired,
    fileName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      fileName: props.fileName
    };

    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  getFileOptions = () => this.props.files.map((file) => {
    const fileName = file.file_name;
    return {
      key: fileName,
      value: fileName,
      text: fileName
    };
  });

  handleFileNameOnChange = (e, { value }) => {
    if (value !== this.state.fileName) {
      this.setState({
        fileName: value
      }, this.handleOnChange);
    }
  };

  handleOnChange = () => {
    const { fileName } = this.state;
    const { onChange } = this.props;
    onChange(fileName);
  };

  render() {
    const { fileName } = this.state;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={2}>
            <div className="right-aligned-label">
              <label>Files</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              fluid
              selectOnNavigation={false}
              selection
              name="false"
              options={this.getFileOptions()}
              onChange={this.handleFileNameOnChange}
              value={fileName}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default FilesDropdownFilter;
