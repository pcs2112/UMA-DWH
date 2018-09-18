import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Dimmer } from 'semantic-ui-react';
import { DetailsDiv, DetailsColDiv, DetailsLabel, DetailsRow } from './css';

class StatisticsTable extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  };

  getValue = (key) => {
    if (!this.props.dataLoaded || this.props.data.length < 1) {
      return 0;
    }

    return this.props.data[0][key];
  };

  render() {
    const { isFetching } = this.props;
    return (
      <Dimmer.Dimmable as={Segment} dimmed={isFetching}>
        <DetailsDiv>
          <DetailsColDiv>
            <DetailsRow><DetailsLabel>DAY_COUNT: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
            <DetailsRow><DetailsLabel>DAY_AVG_RUN_TIME: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
            <DetailsRow><DetailsLabel>DAY_AVG_ROWS_RETURNED: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
          </DetailsColDiv>
          <DetailsColDiv>
            <DetailsRow><DetailsLabel>WEEK_COUNT: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
            <DetailsRow><DetailsLabel>WEEK_AVG_RUN_TIME: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
            <DetailsRow><DetailsLabel>WEEK_AVG_ROWS_RETURNED: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
          </DetailsColDiv>
          <DetailsColDiv>
            <DetailsRow><DetailsLabel>LAST_30_DAY_COUNT: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
            <DetailsRow><DetailsLabel>LAST_30_AVG_RUN_TIME: </DetailsLabel>{this.getValue('day_count')}</DetailsRow>
            <DetailsRow>
              <DetailsLabel>LAST_30_DAY_AVG_ROWS_RETURNED: </DetailsLabel>{this.getValue('day_count')}
            </DetailsRow>
          </DetailsColDiv>
        </DetailsDiv>
      </Dimmer.Dimmable>
    );
  }
}

export default StatisticsTable;
