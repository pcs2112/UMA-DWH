import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';

class ManualRuns extends Component {
  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA ETL Manual Runs
          </h1>
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  null
)(ManualRuns));
