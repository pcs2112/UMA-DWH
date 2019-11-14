import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  Segment, Grid, Dropdown, Button, Form, Input
} from 'semantic-ui-react';
import { objectHasOwnProperty, isEmpty } from 'javascript-utils/lib/utils';
import { DEFAULT_DATE_FORMAT, DEAULT_MONTHS_SIZE } from '../../constants/index';
import intervalDurations from '../../constants/cycleHistoryIntervalDurations';
import etlCurrentStatusRdx from '../../redux/modules/etlCurrentStatus';
import etlCycleHistoryRdx from '../../redux/modules/etlCycleHistory';
import etlProcedureHistoryRdx from '../../redux/modules/etlProcedureHistory';
import withMainLayout from '../../components/WithMainLayout';
import CycleArrowPagination from '../../components/CycleArrowPagination';
import globalCss from '../../css/global';
import CycleHistoryTable from './CycleHistoryTable';
import CurrentStatusTable from './CurrentStatusTable';
import CycleHistoryPageHeader from './CycleHistoryPageHeader';
import Filters from './Filters';
import { runCheckButtonCss } from './css';

class Home extends Component {
  static propTypes = {
    // Cycle history props
    dispatchPollingAction: PropTypes.func.isRequired,
    isCycleHistoryFetching: PropTypes.bool.isRequired,
    cycleHistoryDataLoaded: PropTypes.bool.isRequired,
    cycleHistoryData: PropTypes.array.isRequired,
    cycleHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    currentCycleGroup: PropTypes.number.isRequired,
    currentCycleGroupStartDttm: PropTypes.string.isRequired,
    cycleHistoryIntervalDuration: PropTypes.number.isRequired,
    cycleHistoryDate: PropTypes.string,
    cycleHistoryFilters: PropTypes.object.isRequired,
    cycleHistorySelectedCount: PropTypes.number.isRequired,
    cycleHistorySelectedData: PropTypes.object.isRequired,
    proceduresSelectedCount: PropTypes.number.isRequired,
    lastProcedureSelected: PropTypes.object,
    fetchCycleHistory: PropTypes.func.isRequired,
    fetchPrevCycleHistory: PropTypes.func.isRequired,
    fetchNextCycleHistory: PropTypes.func.isRequired,
    resetCycleHistory: PropTypes.func.isRequired,
    selectCycleHistoryData: PropTypes.func.isRequired,
    unselectCycleHistoryData: PropTypes.func.isRequired,
    unselectAllCycleHistoryData: PropTypes.func.isRequired,
    setCycleHistoryIntervalDuration: PropTypes.func.isRequired,
    setCycleHistoryFilters: PropTypes.func.isRequired,
    // Control status props
    isCurrentStatusFetching: PropTypes.bool.isRequired,
    currentStatusData: PropTypes.array.isRequired,
    currentStatusDataTotals: PropTypes.object.isRequired,
    currentEtlStatus: PropTypes.string.isRequired,
    dataMartsSelectedCount: PropTypes.number.isRequired,
    dataMartsSelectedData: PropTypes.object.isRequired,
    selectDataMartData: PropTypes.func.isRequired,
    unselectDataMartData: PropTypes.func.isRequired,
    // Procedure history props
    setProcedureHistoryFilters: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    })
  };

  componentDidMount() {
    const { cycleHistoryIntervalDuration } = this.props;
    this.startPolling(cycleHistoryIntervalDuration);
  }

  componentWillUnmount() {
    this.stopPolling();
    this.props.resetCycleHistory();
  }

  handleCycleHistoryIntervalOnChange = (e, { value }) => {
    const { cycleHistoryIntervalDuration } = this.props;
    const newValue = parseInt(value, 10);
    if (cycleHistoryIntervalDuration !== newValue) {
      this.props.setCycleHistoryIntervalDuration(value);
      this.stopPolling();
      if (newValue > 0) {
        this.startPolling(parseInt(value, 10));
      }
    }
  };

  handleViewHistoryOnClick = () => {
    const { setProcedureHistoryFilters, lastProcedureSelected } = this.props;
    if (lastProcedureSelected && !isEmpty(lastProcedureSelected.source_server_name)) {
      setProcedureHistoryFilters(
        lastProcedureSelected.source_server_name.toUpperCase(),
        lastProcedureSelected.source_db_name.toUpperCase(),
        lastProcedureSelected.calling_proc.toUpperCase(),
        moment().format(DEFAULT_DATE_FORMAT),
        DEAULT_MONTHS_SIZE
      );
    }

    setTimeout(() => {
      this.context.router.history.push('/procedures/history');
    }, 250);
  };

  handleActiveFilterButton = () => {
    const { cycleHistoryFilters, setCycleHistoryFilters } = this.props;
    setCycleHistoryFilters('active', !objectHasOwnProperty(cycleHistoryFilters, 'active')
    || cycleHistoryFilters.active === 1 ? 0 : 1);
  };

  handleDateFilter = (e, { value }) => {
    const { fetchCycleHistory } = this.props;
    fetchCycleHistory(0, value);
  };

  startPolling = (interval) => {
    const { dispatchPollingAction } = this.props;
    this.pollingActions = etlCycleHistoryRdx.actions.getPollingActions(interval);
    dispatchPollingAction(this.pollingActions.start(dispatchPollingAction));
  };

  stopPolling = () => {
    const { dispatchPollingAction } = this.props;
    dispatchPollingAction(this.pollingActions.reset());
  };

  render() {
    const {
      isCycleHistoryFetching,
      cycleHistoryDataLoaded,
      cycleHistoryData,
      cycleHistoryFetchingError,
      currentCycleGroup,
      currentCycleGroupStartDttm,
      cycleHistoryIntervalDuration,
      cycleHistoryDate,
      cycleHistoryFilters,
      cycleHistorySelectedCount,
      cycleHistorySelectedData,
      proceduresSelectedCount,
      fetchPrevCycleHistory,
      fetchNextCycleHistory,
      selectCycleHistoryData,
      unselectCycleHistoryData,
      unselectAllCycleHistoryData,
      isCurrentStatusFetching,
      currentStatusData,
      currentStatusDataTotals,
      currentEtlStatus,
      dataMartsSelectedCount,
      dataMartsSelectedData,
      selectDataMartData,
      unselectDataMartData,
      setCycleHistoryFilters
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <CycleHistoryPageHeader
            cycleHistoryFilters={cycleHistoryFilters}
            currentEtlStatus={currentEtlStatus}
            cycleHistoryDate={cycleHistoryDate}
          />
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={8}>
              <Filters
                onChange={setCycleHistoryFilters}
                {...cycleHistoryFilters}
              />
            </Grid.Column>
          </Grid>
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
            dataMartsSelectedCount={dataMartsSelectedCount}
            filters={cycleHistoryFilters}
          />
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={11}>
              <CurrentStatusTable
                isFetching={isCurrentStatusFetching}
                data={currentStatusData}
                dataTotals={currentStatusDataTotals}
                fetchingError={false}
                selectedData={dataMartsSelectedData}
                selectData={selectDataMartData}
                unselectData={unselectDataMartData}
              />
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
                as={Link}
                to="/etl/runs/manual"
              >
                Manual Runs
              </Button>
              <Button
                size="small"
                style={runCheckButtonCss}
                disabled={cycleHistorySelectedCount < 1 && dataMartsSelectedCount < 1}
                onClick={unselectAllCycleHistoryData}
              >
                Uncheck All
              </Button>
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
              <Form size="small">
                <Form.Field>
                  <label>Date</label>
                  <Input
                    type="date"
                    name="date"
                    fluid
                    onChange={this.handleDateFilter}
                    value={cycleHistoryDate}
                    max={moment().subtract(1, 'days').format(DEFAULT_DATE_FORMAT)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Refresh Interval</label>
                  <Dropdown
                    fluid
                    selectOnNavigation={false}
                    selection
                    name="false"
                    options={intervalDurations}
                    placeholder="Interval"
                    onChange={this.handleCycleHistoryIntervalOnChange}
                    upward
                    defaultValue={cycleHistoryIntervalDuration}
                  />
                </Form.Field>
              </Form>
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
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isCycleHistoryFetching: state.etlCycleHistory.isFetching,
    cycleHistoryDataLoaded: state.etlCycleHistory.dataLoaded,
    cycleHistoryData: etlCycleHistoryRdx.selectors.getHistoryByCycleGroup(state),
    cycleHistoryFetchingError: etlCycleHistoryRdx.selectors.getFetchingError(state),
    currentCycleGroup: etlCycleHistoryRdx.selectors.getCurrentCycleGroup(state),
    currentCycleGroupStartDttm: etlCycleHistoryRdx.selectors.getCurrentCycleGroupStartDttm(state),
    cycleHistoryIntervalDuration: etlCycleHistoryRdx.selectors.getIntervalDuration(state),
    cycleHistoryDate: etlCycleHistoryRdx.selectors.getCycleDate(state),
    cycleHistoryFilters: etlCycleHistoryRdx.selectors.getFilters(state),
    cycleHistorySelectedCount: etlCycleHistoryRdx.selectors.getSelectedCount(state),
    cycleHistorySelectedData: etlCycleHistoryRdx.selectors.getSelected(state),
    proceduresSelectedCount: etlCycleHistoryRdx.selectors.getSelectedCount(state),
    lastProcedureSelected: etlCycleHistoryRdx.selectors.getLastSelected(state),
    dataMartsSelectedCount: etlCurrentStatusRdx.selectors.getSelectedCount(state),
    dataMartsSelectedData: etlCurrentStatusRdx.selectors.getSelected(state),
    isCurrentStatusFetching: state.etlCurrentStatus.isFetching,
    currentStatusData: etlCurrentStatusRdx.selectors.getCurrentStatus(state),
    currentStatusDataTotals: etlCurrentStatusRdx.selectors.getCurrentStatusTotals(state),
    currentEtlStatus: etlCurrentStatusRdx.selectors.getCurrentEtlStatus(state)
  }),
  dispatch => ({
    dispatchPollingAction: dispatch,
    fetchCycleHistory: (cycleGroup, cycleDate) =>
      dispatch(etlCycleHistoryRdx.actions.fetchHistory(cycleGroup, cycleDate)),
    fetchPrevCycleHistory: () => dispatch(etlCycleHistoryRdx.actions.fetchPrev()),
    fetchNextCycleHistory: () => dispatch(etlCycleHistoryRdx.actions.fetchNext()),
    resetCycleHistory: () => dispatch(etlCycleHistoryRdx.actions.reset()),
    selectCycleHistoryData: data => dispatch(etlCycleHistoryRdx.actions.select(data)),
    unselectCycleHistoryData: (id, data) => dispatch(etlCycleHistoryRdx.actions.unselect(id, data)),
    unselectAllCycleHistoryData: () => dispatch(etlCycleHistoryRdx.actions.unselectAll()),
    selectDataMartData: data => dispatch(etlCurrentStatusRdx.actions.select(data)),
    unselectDataMartData: (id, data) => dispatch(etlCurrentStatusRdx.actions.unselect(id, data)),
    setCycleHistoryIntervalDuration: intervalDuration =>
      dispatch(etlCycleHistoryRdx.actions.setFilters('intervalDuration', intervalDuration)),
    setCycleHistoryFilters: (key, value) => dispatch(etlCycleHistoryRdx.actions.setFilters(key, value)),
    setProcedureHistoryFilters: (serverName, dbName, procedureName, date, months) =>
      dispatch(etlProcedureHistoryRdx.actions.setFilters(serverName, dbName, procedureName, date, months))
  })
)(Home));
