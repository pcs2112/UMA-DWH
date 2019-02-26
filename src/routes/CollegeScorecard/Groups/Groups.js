import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import collegeScorecardGroupsReduxModule from '../../../redux/modules/collegeScorecardGroups';
import collegeScorecardFilesReduxModule from '../../../redux/modules/collegeScorecardFiles';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import FilesDropdownFilter from '../FilesDropdownFilter';
import ColumnsTable from '../ColumnsTable';
import columns from './columns';

class Groups extends Component {
  static propTypes = {
    collegeScorecardFilesData: PropTypes.array.isRequired,
    isCollegeScorecardGroupsFetching: PropTypes.bool.isRequired,
    collegeScorecardGroupsDataLoaded: PropTypes.bool.isRequired,
    collegeScorecardGroupsData: PropTypes.array.isRequired,
    collegeScorecardFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    collegeScorecardSelectedData: PropTypes.object.isRequired,
    collegeScorecardSelectedCount: PropTypes.number.isRequired,
    collegeScorecardFilters: PropTypes.object.isRequired,
    fetchCollegeScorecardGroupsData: PropTypes.func.isRequired,
    resetCollegeScorecardGroupsData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    selectAllData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    unselectAllData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchCollegeScorecardGroupsData, collegeScorecardFilters } = this.props;
    const { fileName, group } = collegeScorecardFilters;
    fetchCollegeScorecardGroupsData(fileName, group);
  }

  componentWillUnmount() {
    const { resetCollegeScorecardGroupsData } = this.props;
    resetCollegeScorecardGroupsData();
  }

  render() {
    const {
      collegeScorecardFilesData,
      collegeScorecardGroupsDataLoaded,
      collegeScorecardGroupsData,
      isCollegeScorecardGroupsFetching,
      collegeScorecardFetchingError,
      collegeScorecardSelectedData,
      collegeScorecardSelectedCount,
      collegeScorecardFilters,
      fetchCollegeScorecardGroupsData,
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
                onChange={fetchCollegeScorecardGroupsData}
                {...collegeScorecardFilters}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ColumnsTable
            dataLoaded={collegeScorecardGroupsDataLoaded}
            data={collegeScorecardGroupsData}
            isFetching={isCollegeScorecardGroupsFetching}
            fetchingError={collegeScorecardFetchingError}
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
          <Button
            size="small"
            primary
            disabled={isCollegeScorecardGroupsFetching}
          >
            Export
          </Button>
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    collegeScorecardFilesData: collegeScorecardFilesReduxModule.selectors.getCollegeScorecardFilesData(state),
    isCollegeScorecardGroupsFetching: state.collegeScorecardGroups.isFetching,
    collegeScorecardGroupsDataLoaded: state.collegeScorecardGroups.dataLoaded,
    collegeScorecardGroupsData: collegeScorecardGroupsReduxModule.selectors.getCollegeScorecardGroupsData(state),
    collegeScorecardFetchingError: collegeScorecardGroupsReduxModule.selectors.getFetchingError(state),
    collegeScorecardSelectedData: collegeScorecardGroupsReduxModule.selectors.getSelected(state),
    collegeScorecardSelectedCount: collegeScorecardGroupsReduxModule.selectors.getSelectedCount(state),
    collegeScorecardFilters: collegeScorecardGroupsReduxModule.selectors.getFilters(state),
  }),
  dispatch => ({
    fetchCollegeScorecardGroupsData: (fileName, group) =>
      dispatch(collegeScorecardGroupsReduxModule.actions.fetch(fileName, group)),
    resetCollegeScorecardGroupsData: () => {
      dispatch(collegeScorecardGroupsReduxModule.actions.reset());
    },
    selectData: data => dispatch(collegeScorecardGroupsReduxModule.actions.select(data)),
    selectAllData: () => dispatch(collegeScorecardGroupsReduxModule.actions.selectAll()),
    unselectData: id => dispatch(collegeScorecardGroupsReduxModule.actions.unselect(id)),
    unselectAllData: () => dispatch(collegeScorecardGroupsReduxModule.actions.unselectAll()),
  })
)(Groups));
