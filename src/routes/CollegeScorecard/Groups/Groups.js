import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import collegeScorecardReduxModule from '../../../redux/modules/collegeScorecard';
import collegeScorecardGroupsReduxModule from '../../../redux/modules/collegeScorecardGroups';
import collegeScorecardFilesReduxModule from '../../../redux/modules/collegeScorecardFiles';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import FilesDropdownFilter from '../FilesDropdownFilter';
import VirtualTable from '../VirtualTable';
import columns from './columns';

class Groups extends Component {
  static propTypes = {
    isDataFetching: PropTypes.bool.isRequired,
    isAllDataLoaded: PropTypes.bool.isRequired,
    collegeScorecardFilesData: PropTypes.array.isRequired,
    collegeScorecardGroupsData: PropTypes.array.isRequired,
    collegeScorecardGroupsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    collegeScorecardSelectedData: PropTypes.object.isRequired,
    collegeScorecardSelectedCount: PropTypes.number.isRequired,
    collegeScorecardFilters: PropTypes.object.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    selectAllData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    unselectAllData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const {
      isDataFetching,
      isAllDataLoaded,
      fetchAllData,
      collegeScorecardFilters
    } = this.props;
    if (!isDataFetching && !isAllDataLoaded) {
      const { fileName } = collegeScorecardFilters;
      fetchAllData(fileName);
    }
  }

  render() {
    const {
      isDataFetching,
      isAllDataLoaded,
      collegeScorecardFilesData,
      collegeScorecardGroupsData,
      collegeScorecardGroupsFetchingError,
      collegeScorecardSelectedData,
      collegeScorecardSelectedCount,
      collegeScorecardFilters,
      fetchAllData,
      selectData,
      selectAllData,
      unselectData,
      unselectAllData
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            College Scorecard Groups
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={5}>
              <FilesDropdownFilter
                files={collegeScorecardFilesData}
                onChange={fetchAllData}
                {...collegeScorecardFilters}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <VirtualTable
            dataLoaded={isAllDataLoaded}
            data={collegeScorecardGroupsData}
            isFetching={isDataFetching}
            fetchingError={collegeScorecardGroupsFetchingError}
            selectedData={collegeScorecardSelectedData}
            selectedDataCount={collegeScorecardSelectedCount}
            selectData={selectData}
            unselectData={unselectData}
            columns={columns}
            keyName="group_id"
          />
        </Segment>
        <Segment>
          <Button
            size="small"
            disabled={isDataFetching}
            onClick={collegeScorecardSelectedCount < 1 ? selectAllData : unselectAllData}
          >
            {collegeScorecardSelectedCount < 1 ? 'Check All' : 'Uncheck All'}
          </Button>
          <Button
            size="small"
            as={Link}
            to="/college_scorecard/reporting"
          >
            View Reporting
          </Button>
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isDataFetching: state.collegeScorecard.isFetching || state.collegeScorecardGroups.isFetching,
    isAllDataLoaded: state.collegeScorecard.dataLoaded && state.collegeScorecardGroups.dataLoaded,
    collegeScorecardFilesData: collegeScorecardFilesReduxModule.selectors.getCollegeScorecardFilesData(state),
    collegeScorecardGroupsData: collegeScorecardGroupsReduxModule.selectors.getCollegeScorecardGroupsData(state),
    collegeScorecardGroupsFetchingError: collegeScorecardGroupsReduxModule.selectors.getFetchingError(state),
    collegeScorecardSelectedData: collegeScorecardGroupsReduxModule.selectors.getSelected(state),
    collegeScorecardSelectedCount: collegeScorecardGroupsReduxModule.selectors.getSelectedCount(state),
    collegeScorecardFilters: collegeScorecardGroupsReduxModule.selectors.getFilters(state),
  }),
  dispatch => ({
    fetchAllData: fileName => Promise.all([
      dispatch(collegeScorecardReduxModule.actions.fetch(fileName)),
      dispatch(collegeScorecardGroupsReduxModule.actions.fetch(fileName))
    ]),
    resetAllData: () => {
      dispatch(collegeScorecardReduxModule.actions.reset());
      dispatch(collegeScorecardGroupsReduxModule.actions.reset());
    },
    selectData: data => dispatch(collegeScorecardGroupsReduxModule.actions.select(data)),
    selectAllData: () => dispatch(collegeScorecardGroupsReduxModule.actions.selectAll()),
    unselectData: (id, data) => dispatch(collegeScorecardGroupsReduxModule.actions.unselect(id, data)),
    unselectAllData: () => dispatch(collegeScorecardGroupsReduxModule.actions.unselectAll()),
  })
)(Groups));
