import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Segment, Grid, Button } from 'semantic-ui-react';
import tryCatchErrorsChart from 'redux/modules/tryCatchErrorsChart';
import tryCatchErrors from 'redux/modules/tryCatchErrors';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import ErrorsTable from './ErrorsTable';
import DateChartFilter from './DateChartFilter';
import DropdownFilters from './DropdownFilters';
import { DEFAULT_DATE_FORMAT } from '../../constants';

class DWHErrors extends Component {
  static propTypes = {
    isTryCatchErrorsFetching: PropTypes.bool.isRequired,
    tryCatchErrorsDataLoaded: PropTypes.bool.isRequired,
    tryCatchErrorsData: PropTypes.array.isRequired,
    tryCatchErrorsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    tryCatchErrorsFilters: PropTypes.object.isRequired,
    isTryCatchErrorsChartFetching: PropTypes.bool.isRequired,
    tryCatchErrorsChartDataLoaded: PropTypes.bool.isRequired,
    tryCatchErrorsChartData: PropTypes.array.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData, tryCatchErrorsFilters } = this.props;
    const { date, months } = tryCatchErrorsFilters;
    fetchAllData(date, months);
  }

  componentWillUnmount() {
    const { resetAllData } = this.props;
    resetAllData();
  }

  resetChart = () => {
    const { fetchAllData } = this.props;
    const { months } = this.props.tryCatchErrorsFilters;
    fetchAllData(moment().format(DEFAULT_DATE_FORMAT), months);
  };

  render() {
    const {
      isTryCatchErrorsFetching,
      tryCatchErrorsDataLoaded,
      tryCatchErrorsData,
      tryCatchErrorsFetchingError,
      tryCatchErrorsFilters,
      isTryCatchErrorsChartFetching,
      tryCatchErrorsChartDataLoaded,
      tryCatchErrorsChartData,
      fetchAllData
    } = this.props;

    const current = moment(tryCatchErrorsFilters.date, DEFAULT_DATE_FORMAT);
    const today = moment();

    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {__APP_TITLE__} - DWH Errors{' '}
            ({current.format('MMM D, YYYY')})
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={11}>
              <DateChartFilter
                isFetching={isTryCatchErrorsChartFetching}
                dataLoaded={tryCatchErrorsChartDataLoaded}
                data={tryCatchErrorsChartData}
                onClick={fetchAllData}
                {...tryCatchErrorsFilters}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DropdownFilters
                onChange={fetchAllData}
                {...tryCatchErrorsFilters}
              />
              <div className="right-aligned">
                <Button primary onClick={this.resetChart} disabled={today.isSame(current, 'day')}>
                  Reset Chart
                </Button>
              </div>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ErrorsTable
            dataLoaded={tryCatchErrorsDataLoaded}
            data={tryCatchErrorsData}
            isFetching={isTryCatchErrorsFetching}
            fetchingError={tryCatchErrorsFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isTryCatchErrorsFetching: state.tryCatchErrors.isFetching,
    tryCatchErrorsDataLoaded: state.tryCatchErrors.dataLoaded,
    tryCatchErrorsData: tryCatchErrors.selectors.getTryCatchErrors(state),
    tryCatchErrorsFetchingError: tryCatchErrors.selectors.getFetchingError(state),
    tryCatchErrorsFilters: tryCatchErrors.selectors.getFilters(state),
    isTryCatchErrorsChartFetching: state.tryCatchErrorsChart.isFetching,
    tryCatchErrorsChartDataLoaded: state.tryCatchErrorsChart.dataLoaded,
    tryCatchErrorsChartData: tryCatchErrorsChart.selectors.getTryCatchErrorsChartData(state)
  }),
  dispatch => ({
    fetchAllData: (date, months) =>
      Promise.all([
        dispatch(tryCatchErrors.actions.fetch(date, months)),
        dispatch(tryCatchErrorsChart.actions.fetch(date, months))
      ]),
    resetAllData: () => {
      dispatch(tryCatchErrors.actions.reset());
      dispatch(tryCatchErrorsChart.actions.reset());
    }
  })
)(DWHErrors));
