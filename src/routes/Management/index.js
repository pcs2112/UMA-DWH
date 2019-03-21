import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Segment
} from 'semantic-ui-react';
import withMainLayout from '../../components/WithMainLayout';
import globalCss from '../../css/global';

class Management extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    })
  };

  render() {
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          ETL Management
        </Segment>
        <Segment>
          table
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  null,
  null
)(Management));
