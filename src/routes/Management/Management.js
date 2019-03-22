import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Segment
} from 'semantic-ui-react';
import withMainLayout from '../../components/WithMainLayout';
import withResponsiveContainer from '../../components/WithResponsiveContainer';
import VirtualTable from '../../components/VirtualTable';
import globalCss from '../../css/global';
import etlManagementReduxModule from '../../redux/modules/etlManagement';
import columns from './columns';

const Table = withResponsiveContainer(VirtualTable, 400, 160);

class Management extends Component {
  static propTypes = {
    isDataFetching: PropTypes.bool.isRequired,
    isAllDataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchAllData: PropTypes.func.isRequired,
    // resetAllData: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    })
  };

  componentDidMount() {
    const {
      isDataFetching, isAllDataLoaded, fetchAllData
    } = this.props;

    if (!isDataFetching && !isAllDataLoaded) {
      fetchAllData();
    }
  }

  render() {
    const {
      isAllDataLoaded,
      isDataFetching,
      data,
      fetchingError
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            ETL Management
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <Table
            dataLoaded={isAllDataLoaded}
            data={data}
            isFetching={isDataFetching}
            fetchingError={fetchingError}
            columns={columns}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isDataFetching: state.etlManagement.isFetching,
    isAllDataLoaded: state.etlManagement.dataLoaded,
    data: etlManagementReduxModule.selectors.getData(state),
    fetchingError: etlManagementReduxModule.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchAllData: () => Promise.all([
      dispatch(etlManagementReduxModule.actions.fetch())
    ]),
    resetAllData: () => {
      dispatch(etlManagementReduxModule.actions.reset());
    }
  })
)(Management));
