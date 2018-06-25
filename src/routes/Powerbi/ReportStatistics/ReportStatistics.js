import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import config from 'config';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';

class ReportStatistics extends Component {
  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Power BI Report Statistics
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          table
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(ReportStatistics);
