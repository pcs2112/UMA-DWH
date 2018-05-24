import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

class Error extends Component {
  render() {
    return (
      <div>
        <Message
          error
          header="404 Error"
          content="Page not found."
          icon="remove"
          size="huge"
        />
      </div>
    );
  }
}

export default Error;
