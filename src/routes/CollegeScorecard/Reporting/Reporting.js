import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import collegeScorecardReduxModule from '../../../redux/modules/collegeScorecard';
import collegeScorecardFilesReduxModule from '../../../redux/modules/collegeScorecardFiles';
import collegeScorecardGroupsReduxModule from '../../../redux/modules/collegeScorecardGroups';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import FilesDropdownFilter from '../FilesDropdownFilter';
import ColumnsTable from '../ColumnsTable';
import columns from './columns';

class Reporting extends Component {
  static propTypes = {
    collegeScorecardFilesData: PropTypes.array.isRequired,
    isCollegeScorecardFetching: PropTypes.bool.isRequired,
    collegeScorecardDataLoaded: PropTypes.bool.isRequired,
    collegeScorecardData: PropTypes.array.isRequired,
    collegeScorecardFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    collegeScorecardSelectedData: PropTypes.object.isRequired,
    collegeScorecardSelectedCount: PropTypes.number.isRequired,
    collegeScorecardFilters: PropTypes.object.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    selectAllData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    unselectAllData: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData, collegeScorecardFilters } = this.props;
    const { fileName } = collegeScorecardFilters;
    fetchAllData(fileName);
  }

  componentWillUnmount() {
    const { resetAllData } = this.props;
    resetAllData();
  }

  handleViewFilterButton = () => {
    const { setFilters, collegeScorecardFilters } = this.props;
    const { populated } = collegeScorecardFilters;
    const newPopulated = populated === '' ? 'ALL' : '';
    setFilters('populated', newPopulated);
  };

  render() {
    const {
      collegeScorecardFilesData,
      collegeScorecardDataLoaded,
      collegeScorecardData,
      isCollegeScorecardFetching,
      collegeScorecardFetchingError,
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
            College Scorecard Reporting
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
          <ColumnsTable
            dataLoaded={collegeScorecardDataLoaded}
            data={collegeScorecardData}
            isFetching={isCollegeScorecardFetching}
            fetchingError={collegeScorecardFetchingError}
            selectedData={collegeScorecardSelectedData}
            selectedDataCount={collegeScorecardSelectedCount}
            selectData={selectData}
            unselectData={unselectData}
            columns={columns}
            keyName="dictionary_entry_id"
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
            disabled={isCollegeScorecardFetching}
            onClick={this.handleViewFilterButton}
          >
            {collegeScorecardFilters.populated === '' ? 'View All' : 'View Populated'}
          </Button>
          <Button
            size="small"
            as={Link}
            to="/college_scorecard/groups"
          >
            View Groups
          </Button>
          <Button
            size="small"
            primary
            disabled={isCollegeScorecardFetching}
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
    isCollegeScorecardFetching: state.collegeScorecard.isFetching,
    collegeScorecardDataLoaded: state.collegeScorecard.dataLoaded,
    collegeScorecardData: collegeScorecardReduxModule.selectors.getCollegeScorecardData(state),
    collegeScorecardFetchingError: collegeScorecardReduxModule.selectors.getFetchingError(state),
    collegeScorecardSelectedData: collegeScorecardReduxModule.selectors.getSelected(state),
    collegeScorecardSelectedCount: collegeScorecardReduxModule.selectors.getSelectedCount(state),
    collegeScorecardFilters: collegeScorecardReduxModule.selectors.getFilters(state),
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
    selectData: data => dispatch(collegeScorecardReduxModule.actions.select(data)),
    selectAllData: () => dispatch(collegeScorecardReduxModule.actions.selectAll()),
    unselectData: id => dispatch(collegeScorecardReduxModule.actions.unselect(id)),
    unselectAllData: () => dispatch(collegeScorecardReduxModule.actions.unselectAll()),
    setFilters: (key, value) => dispatch(collegeScorecardReduxModule.actions.setFilters(key, value))
  })
)(Reporting));
