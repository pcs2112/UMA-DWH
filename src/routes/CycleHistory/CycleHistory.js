import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Grid, Dropdown, Button } from 'semantic-ui-react';
import config from 'config';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import intervalDurations from 'constants/currentStatusIntervalDurations';
import etlCurrentStatus from 'redux/modules/etlCurrentStatus';
import etlCycleHistory from 'redux/modules/etlCycleHistory';
import withMainLayout from 'components/WithMainLayout';
import CycleArrowPagination from 'components/CycleArrowPagination';
import EtlErrorModal from 'components/EtlErrorModal';
import globalCss from 'css/global';
import CycleHistoryTable from './CycleHistoryTable';
import CurrentStatusTable from './CurrentStatusTable';
import { runCheckButtonCss } from './css';

class Home extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isCycleHistoryFetching: PropTypes.bool.isRequired,
    cycleHistoryDataLoaded: PropTypes.bool.isRequired,
    cycleHistoryData: PropTypes.array.isRequired,
    cycleHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    currentCycleGroup: PropTypes.number.isRequired,
    currentCycleGroupStartDttm: PropTypes.string.isRequired,
    pollFirstCycleGroup: PropTypes.func.isRequired,
    fetchPrevCycleHistory: PropTypes.func.isRequired,
    fetchNextCycleHistory: PropTypes.func.isRequired,
    resetCycleHistory: PropTypes.func.isRequired,
    clearCycleHistoryFetchingError: PropTypes.func.isRequired,
    cycleHistorySelectedData: PropTypes.object.isRequired,
    selectCycleHistoryData: PropTypes.func.isRequired,
    unselectCycleHistoryData: PropTypes.func.isRequired,
    unselectAllCycleHistoryData: PropTypes.func.isRequired,
    cycleHistorySelectedCount: PropTypes.number.isRequired,
    proceduresSelectedCount: PropTypes.number.isRequired,
    dataMartsSelectedCount: PropTypes.number.isRequired,
    isCurrentStatusFetching: PropTypes.bool.isRequired,
    currentStatusData: PropTypes.array.isRequired,
    currentStatusDataTotals: PropTypes.object.isRequired,
    currentStatusIntervalDuration: PropTypes.number.isRequired,
    fetchCurrentStatus: PropTypes.func.isRequired,
    setCurrentStatusIntervalDuration: PropTypes.func.isRequired,
    setCycleHistoryFilters: PropTypes.func.isRequired,
    cycleHistoryFilters: PropTypes.object.isRequired
  };

  componentWillUnmount() {
    this.props.resetCycleHistory();
  }

  handleCurrentStatusIntervalOnChange = (e, { value }) => this.props.setCurrentStatusIntervalDuration(value);

  handleViewHistoryOnClick = () => {
    this.props.history.push('/procedures/history');
  };

  handleActiveFilterButton = () => {
    const { cycleHistoryFilters, setCycleHistoryFilters } = this.props;
    setCycleHistoryFilters('active', !objectHasOwnProperty(cycleHistoryFilters, 'active')
    || cycleHistoryFilters.active === 1 ? 0 : 1);
  };

  renderPageTitle = () => {
    const { cycleHistoryFilters } = this.props;
    let title = `${config.app.title} - ETL Cycle History`;
    if (cycleHistoryFilters.active === 0) {
      title += ' (INACTIVE)';
    }
    return (
      <h1 style={cycleHistoryFilters.active === 0 ? globalCss.errorPageHeaderSegmentH1 : globalCss.pageHeaderSegmentH1}>
        {title}
      </h1>
    );
  };

  render() {
    const {
      isCycleHistoryFetching,
      cycleHistoryDataLoaded,
      cycleHistoryData,
      cycleHistoryFetchingError,
      currentCycleGroup,
      currentCycleGroupStartDttm,
      pollFirstCycleGroup,
      fetchPrevCycleHistory,
      fetchNextCycleHistory,
      clearCycleHistoryFetchingError,
      cycleHistorySelectedData,
      selectCycleHistoryData,
      unselectCycleHistoryData,
      unselectAllCycleHistoryData,
      cycleHistorySelectedCount,
      proceduresSelectedCount,
      dataMartsSelectedCount,
      isCurrentStatusFetching,
      currentStatusData,
      currentStatusDataTotals,
      currentStatusIntervalDuration,
      fetchCurrentStatus,
      cycleHistoryFilters
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          {this.renderPageTitle()}
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <CycleHistoryTable
            isFetching={isCycleHistoryFetching}
            dataLoaded={cycleHistoryDataLoaded}
            data={cycleHistoryData}
            fetchingError={cycleHistoryFetchingError}
            selectedData={cycleHistorySelectedData}
            selectData={selectCycleHistoryData}
            unselectData={unselectCycleHistoryData}
            intervalDuration={currentStatusIntervalDuration}
            onInterval={pollFirstCycleGroup}
            dataMartsSelectedCount={dataMartsSelectedCount}
            filters={cycleHistoryFilters}
          />
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={10}>
              <CurrentStatusTable
                isFetching={isCurrentStatusFetching}
                data={currentStatusData}
                dataTotals={currentStatusDataTotals}
                fetchingError={false}
                intervalDuration={currentStatusIntervalDuration}
                onInterval={fetchCurrentStatus}
                selectedData={cycleHistorySelectedData}
                selectData={selectCycleHistoryData}
                unselectData={unselectCycleHistoryData}
              />
              <Button
                size="small"
                style={runCheckButtonCss}
                disabled={cycleHistorySelectedCount < 1}
              >
                Run Check
              </Button>
              <Button
                size="small"
                style={runCheckButtonCss}
                onClick={this.handleActiveFilterButton}
              >
                {cycleHistoryFilters.active === 0 ? 'View All' : 'View Inactive'}
              </Button>
              <Button
                size="small"
                style={runCheckButtonCss}
                disabled={proceduresSelectedCount < 1}
                onClick={this.handleViewHistoryOnClick}
              >
                View History
              </Button>
              <Button
                size="small"
                style={runCheckButtonCss}
                disabled={cycleHistorySelectedCount < 1}
                onClick={unselectAllCycleHistoryData}
              >
                Uncheck All
              </Button>
            </Grid.Column>
            <Grid.Column width={2} />
            <Grid.Column width={4}>
              <label>Refresh Interval</label>
              <Dropdown
                fluid
                selectOnNavigation={false}
                selection
                name="false"
                options={intervalDurations}
                placeholder="Interval"
                onChange={this.handleCurrentStatusIntervalOnChange}
                upward
                defaultValue={currentStatusIntervalDuration}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment>
          <Grid centered columns={2}>
            <Grid.Column>
              <CycleArrowPagination
                fetchPrev={fetchPrevCycleHistory}
                fetchNext={fetchNextCycleHistory}
                prevDisabled={currentCycleGroup < 1}
                nextDisabled={cycleHistoryData.length < 1}
                cycleGroup={currentCycleGroup}
                cycleGroupStartDttm={currentCycleGroupStartDttm}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        {cycleHistoryFetchingError &&
          <EtlErrorModal
            open
            error={cycleHistoryFetchingError}
            onClose={clearCycleHistoryFetchingError}
          />
        }
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isCycleHistoryFetching: state.etlCycleHistory.isFetching,
    cycleHistoryDataLoaded: state.etlCycleHistory.dataLoaded,
    cycleHistoryData: etlCycleHistory.selectors.getHistoryByCycleGroup(state),
    cycleHistoryFetchingError: etlCycleHistory.selectors.getFetchingError(state),
    currentCycleGroup: etlCycleHistory.selectors.getCurrentCycleGroup(state),
    currentCycleGroupStartDttm: etlCycleHistory.selectors.getCurrentCycleGroupStartDttm(state),
    isCurrentStatusFetching: state.etlCurrentStatus.isFetching,
    currentStatusData: etlCurrentStatus.selectors.getCurrentStatus(state),
    currentStatusDataTotals: etlCurrentStatus.selectors.getCurrentStatusTotals(state),
    currentStatusIntervalDuration: etlCurrentStatus.selectors.getIntervalDuration(state),
    cycleHistorySelectedData: etlCycleHistory.selectors.getSelected(state),
    cycleHistorySelectedCount: etlCycleHistory.selectors.getSelectedCount(state),
    proceduresSelectedCount: etlCycleHistory.selectors.getProceduresSelectedCount(state),
    dataMartsSelectedCount: etlCycleHistory.selectors.getDataMartsSelectedCount(state),
    cycleHistoryFilters: etlCycleHistory.selectors.getFilters(state),
  }),
  dispatch => ({
    pollFirstCycleGroup: () => dispatch(etlCycleHistory.actions.pollFirstCycleGroup()),
    fetchPrevCycleHistory: () => dispatch(etlCycleHistory.actions.fetchPrev()),
    fetchNextCycleHistory: () => dispatch(etlCycleHistory.actions.fetchNext()),
    resetCycleHistory: () => dispatch(etlCycleHistory.actions.reset()),
    clearCycleHistoryFetchingError: () => dispatch(etlCycleHistory.actions.clearFetchingError()),
    selectCycleHistoryData: (id, data) => dispatch(etlCycleHistory.actions.select(id, data)),
    unselectCycleHistoryData: id => dispatch(etlCycleHistory.actions.unselect(id)),
    unselectAllCycleHistoryData: () => dispatch(etlCycleHistory.actions.unselectAll()),
    fetchCurrentStatus: () => dispatch(etlCurrentStatus.actions.fetchCurrentStatus()),
    setCurrentStatusIntervalDuration: intervalDuration =>
      dispatch(etlCurrentStatus.actions.setIntervalDuration(intervalDuration)),
    setCycleHistoryFilters: (key, value) => dispatch(etlCycleHistory.actions.setFilters(key, value))
  })
)(Home));
