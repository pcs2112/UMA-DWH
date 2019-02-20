import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';


class Reporting extends Component {
  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            College Scorecard Reporting
          </h1>
        </Segment>
        <Segment>
          FILTERS
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          TABLE
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  null,
  null
)(Reporting));
