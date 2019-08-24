import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';

class Categories extends Component {
  static propTypes = {
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            College Scorecard Category List
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
)(Categories));
