import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Segment, Grid, Dropdown, Button, Form, Input } from 'semantic-ui-react';
import config from 'config';
import { objectHasOwnProperty, isEmpty } from 'javascript-utils/lib/utils';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
import intervalDurations from 'constants/cycleHistoryIntervalDurations';
import etlCurrentStatus from 'redux/modules/etlCurrentStatus';
import etlCycleHistory from 'redux/modules/etlCycleHistory';
import etlProcedureHistory from 'redux/modules/etlProcedureHistory';
import withMainLayout from 'components/WithMainLayout';
import CycleArrowPagination from 'components/CycleArrowPagination';
import EtlErrorModal from 'components/EtlErrorModal';
import PageHeader from 'components/PageHeader';
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
    cycleHistoryIntervalDuration: PropTypes.number.isRequired,
    cycleHistoryDate: PropTypes.string,
    pollFirstCycleGroup: PropTypes.func.isRequired,
    fetchCycleHistory: PropTypes.func.isRequired,
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
    fetchCurrentStatus: PropTypes.func.isRequired,
    setCycleHistoryIntervalDuration: PropTypes.func.isRequired,
    setCycleHistoryFilters: PropTypes.func.isRequired,
    setProcedureHistoryFilters: PropTypes.func.isRequired,
    cycleHistoryFilters: PropTypes.object.isRequired,
    currentEtlStatus: PropTypes.string.isRequired,
    lastProcedureSelected: PropTypes.object
  };

  componentWillUnmount() {
    this.props.resetCycleHistory();
  }

  handleCycleHistoryIntervalOnChange = (e, { value }) => this.props.setCycleHistoryIntervalDuration(value);

  handleViewHistoryOnClick = () => {
    const { setProcedureHistoryFilters, lastProcedureSelected } = this.props;
    if (lastProcedureSelected && !isEmpty(lastProcedureSelected.source_server_name)) {
      setProcedureHistoryFilters(
        lastProcedureSelected.source_server_name.toUpperCase(),
        lastProcedureSelected.source_db_name.toUpperCase(),
        lastProcedureSelected.calling_proc.toUpperCase(),
        moment().format(DEFAULT_DATE_FORMAT)
      );
    }

    this.props.history.push('/procedures/history');
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

  renderPageTitle = () => {
    const { cycleHistoryFilters, currentEtlStatus, cycleHistoryDate } = this.props;
    let state = '';
    let headerText = `${config.app.title} - ETL Cycle History`;

    if (currentEtlStatus === 'FAILED') {
      state = 'error';
      headerText += ' (FAILED)';
    } else if (currentEtlStatus === 'PAUSED') {
      state = 'warning';
      headerText += ' (PAUSED)';
    } else if (cycleHistoryFilters.active === 0) {
      state = 'error';
      headerText += ' (INACTIVE)';
    } else if (!isEmpty(cycleHistoryDate)) {
      state = 'error';
      headerText += ` (${moment(cycleHistoryDate, DEFAULT_DATE_FORMAT).format('MMM D, YYYY')})`;
    }

    return (
      <PageHeader headerText={headerText} state={state} />
    );
  };

  render() {
    const {
      isCycleHistoryFetching,
      cycleHistoryDataLoaded,
      cycleHistoryData,
      cycleHistoryFetchingError,
      cycleHistoryIntervalDuration,
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
      fetchCurrentStatus,
      cycleHistoryFilters,
      cycleHistoryDate
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
            intervalDuration={cycleHistoryIntervalDuration}
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
                intervalDuration={cycleHistoryIntervalDuration}
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
    cycleHistoryIntervalDuration: etlCycleHistory.selectors.getIntervalDuration(state),
    isCurrentStatusFetching: state.etlCurrentStatus.isFetching,
    currentStatusData: etlCurrentStatus.selectors.getCurrentStatus(state),
    currentStatusDataTotals: etlCurrentStatus.selectors.getCurrentStatusTotals(state),
    cycleHistorySelectedData: etlCycleHistory.selectors.getSelected(state),
    cycleHistorySelectedCount: etlCycleHistory.selectors.getSelectedCount(state),
    cycleHistoryDate: etlCycleHistory.selectors.getCycleDate(state),
    proceduresSelectedCount: etlCycleHistory.selectors.getProceduresSelectedCount(state),
    dataMartsSelectedCount: etlCycleHistory.selectors.getDataMartsSelectedCount(state),
    cycleHistoryFilters: etlCycleHistory.selectors.getFilters(state),
    currentEtlStatus: etlCurrentStatus.selectors.getCurrentEtlStatus(state),
    lastProcedureSelected: etlCycleHistory.selectors.getLastProcedureSelected(state)
  }),
  dispatch => ({
    pollFirstCycleGroup: () => dispatch(etlCycleHistory.actions.pollFirstCycleGroup()),
    fetchCycleHistory: (cycleGroup, cycleDate) => dispatch(etlCycleHistory.actions.fetchHistory(cycleGroup, cycleDate)),
    fetchPrevCycleHistory: () => dispatch(etlCycleHistory.actions.fetchPrev()),
    fetchNextCycleHistory: () => dispatch(etlCycleHistory.actions.fetchNext()),
    resetCycleHistory: () => dispatch(etlCycleHistory.actions.reset()),
    clearCycleHistoryFetchingError: () => dispatch(etlCycleHistory.actions.clearFetchingError()),
    selectCycleHistoryData: (id, data) => dispatch(etlCycleHistory.actions.select(id, data)),
    unselectCycleHistoryData: id => dispatch(etlCycleHistory.actions.unselect(id)),
    unselectAllCycleHistoryData: () => dispatch(etlCycleHistory.actions.unselectAll()),
    fetchCurrentStatus: () => dispatch(etlCurrentStatus.actions.fetchCurrentStatus()),
    setCycleHistoryIntervalDuration: intervalDuration =>
      dispatch(etlCycleHistory.actions.setIntervalDuration(intervalDuration)),
    setCycleHistoryFilters: (key, value) => dispatch(etlCycleHistory.actions.setFilters(key, value)),
    setProcedureHistoryFilters: (serverName, dbName, procedureName, date) =>
      dispatch(etlProcedureHistory.actions.setInitialFilters(serverName, dbName, procedureName, date))
  })
)(Home));
