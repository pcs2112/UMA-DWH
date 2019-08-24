import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import globalCss from 'css/global';
import withMainLayout from 'components/WithMainLayout';

class List extends Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
           UMA Telecom
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          Table here
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  null,
  null
)(List));
