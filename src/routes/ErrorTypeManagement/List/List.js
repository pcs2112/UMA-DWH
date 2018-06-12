import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import config from 'config';
import globalCss from 'css/global';
import withMainLayout from 'components/WithMainLayout';

class List extends Component {
  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Error Type Management
          </h1>
        </Segment>
        <Segment>
          <Button primary>Create Run Book</Button>
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(List);
