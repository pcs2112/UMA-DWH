import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Segment,
  Grid
} from 'semantic-ui-react';
import etlManagementRdx from '../../redux/modules/etlManagement';
import withMainLayout from '../../components/WithMainLayout';
import withResponsiveContainer from '../../components/WithResponsiveContainer';
import VirtualTable from '../../components/VirtualTable';
import Filters from './Filters';
import globalCss from '../../css/global';
import columns from './columns';

const Table = withResponsiveContainer(VirtualTable, 320, 300);

class Management extends Component {
  static propTypes = {
    isDataFetching: PropTypes.bool.isRequired,
    isAllDataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    filters: PropTypes.object.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired
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

  componentWillUnmount() {
    const { resetAllData } = this.props;
    resetAllData();
  }

  handleViewFilterButton = () => {
    const { setFilter, filters: { view } } = this.props;
    const newView = view === '' ? 'ALL' : '';
    setFilter('view', newView);
  };

  render() {
    const {
      isAllDataLoaded,
      isDataFetching,
      data,
      fetchingError,
      filters,
      setFilter
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            ETL Management
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={16}>
              <Filters
                onQueryChange={setFilter}
                {...filters}
              />
            </Grid.Column>
          </Grid>
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
        <Segment>
          <Button
            size="small"
            disabled={isDataFetching}
            onClick={this.handleViewFilterButton}
          >
            {filters.view !== 'ALL' ? 'View All' : 'Exclude Testing'}
          </Button>
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isDataFetching: state.etlManagement.isFetching,
    isAllDataLoaded: state.etlManagement.dataLoaded,
    data: etlManagementRdx.selectors.getData(state),
    fetchingError: etlManagementRdx.selectors.getFetchingError(state),
    filters: etlManagementRdx.selectors.getFilters(state)
  }),
  dispatch => ({
    fetchAllData: () => Promise.all([
      dispatch(etlManagementRdx.actions.fetch())
    ]),
    resetAllData: () => {
      dispatch(etlManagementRdx.actions.reset());
    },
    setFilter: (key, value) => dispatch(etlManagementRdx.actions.setFilter(key, value))
  })
)(Management));
