import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import config from 'config';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';

class ReportHistory extends Component {
  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Powerbi Report History
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          Table
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  null,
  null
)(ReportHistory));
