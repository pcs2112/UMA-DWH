import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import collegeScorecardRdx from '../../../redux/modules/collegeScorecard';
import collegeScorecardGroupsRdx from '../../../redux/modules/collegeScorecardGroups';
import collegeScorecardFilesRdx from '../../../redux/modules/collegeScorecardFiles';
import withMainLayout from '../../../components/WithMainLayout';
import withResponsiveContainer from '../../../components/WithResponsiveContainer';
import CheckboxVirtualTable from '../../../components/CheckboxVirtualTable';
import globalCss from '../../../css/global';
import Filters from './Filters';
import columns from './columns';

const Table = withResponsiveContainer(CheckboxVirtualTable, 320, 300);

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
            College Scorecard - Groups
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={8}>
              <Filters
                fileOptions={collegeScorecardFilesData}
                onFileChange={fetchAllData}
                {...collegeScorecardFilters}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <Table
            dataLoaded={isAllDataLoaded}
            data={collegeScorecardGroupsData}
            isFetching={isDataFetching}
            fetchingError={collegeScorecardGroupsFetchingError}
            selectedData={collegeScorecardSelectedData}
            selectedDataCount={collegeScorecardSelectedCount}
            selectData={selectData}
            unselectData={unselectData}
            columns={columns}
            keyName={collegeScorecardGroupsRdx.constants.LIST_ITEM_KEY_NAME}
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
            Reporting
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
    collegeScorecardFilesData: collegeScorecardFilesRdx.selectors
      .getCollegeScorecardFilesDropdownOptions(state),
    collegeScorecardGroupsData: collegeScorecardGroupsRdx.selectors.getCollegeScorecardGroupsData(state),
    collegeScorecardGroupsFetchingError: collegeScorecardGroupsRdx.selectors.getFetchingError(state),
    collegeScorecardSelectedData: collegeScorecardGroupsRdx.selectors.getSelected(state),
    collegeScorecardSelectedCount: collegeScorecardGroupsRdx.selectors.getSelectedCount(state),
    collegeScorecardFilters: collegeScorecardGroupsRdx.selectors.getFilters(state),
  }),
  dispatch => ({
    fetchAllData: fileName => Promise.all([
      dispatch(collegeScorecardRdx.actions.fetch(fileName)),
      dispatch(collegeScorecardGroupsRdx.actions.fetch(fileName))
    ]),
    resetAllData: () => {
      dispatch(collegeScorecardRdx.actions.reset());
      dispatch(collegeScorecardGroupsRdx.actions.reset());
    },
    selectData: data => dispatch(collegeScorecardGroupsRdx.actions.select(data)),
    selectAllData: () => dispatch(collegeScorecardGroupsRdx.actions.selectAll()),
    unselectData: (id, data) => dispatch(collegeScorecardGroupsRdx.actions.unselect(id, data)),
    unselectAllData: () => dispatch(collegeScorecardGroupsRdx.actions.unselectAll()),
  })
)(Groups));
