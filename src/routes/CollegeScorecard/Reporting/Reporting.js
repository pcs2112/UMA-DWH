import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import { client } from '../../../helpers/ApiClient';
import collegeScorecardReduxModule from '../../../redux/modules/collegeScorecard';
import collegeScorecardFilesReduxModule from '../../../redux/modules/collegeScorecardFiles';
import collegeScorecardGroupsReduxModule from '../../../redux/modules/collegeScorecardGroups';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import FilesDropdownFilter from '../FilesDropdownFilter';
import DragNDrop from '../DragNDrop';
import ColumnsTable from '../ColumnsTable';
import columns from './columns';

const SELECTED_LIMIT = 255;

class Reporting extends Component {
  static propTypes = {
    isDataFetching: PropTypes.bool.isRequired,
    isAllDataLoaded: PropTypes.bool.isRequired,
    collegeScorecardFilesData: PropTypes.array.isRequired,
    collegeScorecardData: PropTypes.array.isRequired,
    collegeScorecardFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    collegeScorecardSelectedData: PropTypes.object.isRequired,
    collegeScorecardSelectedOrderedData: PropTypes.array.isRequired,
    collegeScorecardSelectedCount: PropTypes.number.isRequired,
    collegeScorecardFilters: PropTypes.object.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    selectAllData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    unselectAllData: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    collegeScorecardSelectedColumnNames: PropTypes.array.isRequired,
    reorderSelectedData: PropTypes.func.isRequired
  };

  state = {
    isExporting: false
  };

  componentDidMount() {
    const {
      isDataFetching, isAllDataLoaded, fetchAllData, collegeScorecardFilters
    } = this.props;

    if (!isDataFetching && !isAllDataLoaded) {
      const { fileName } = collegeScorecardFilters;
      fetchAllData(fileName);
    }
  }

  handleViewFilterButton = () => {
    const { setFilters, collegeScorecardFilters } = this.props;
    const { populated } = collegeScorecardFilters;
    const newPopulated = populated === '' ? 'ALL' : '';
    setFilters('populated', newPopulated);
  };

  handleExportButton = () => {
    const { collegeScorecardSelectedColumnNames, collegeScorecardFilters } = this.props;
    const { fileName } = collegeScorecardFilters;
    const now = Math.floor(Date.now() / 1000);
    const outFileName = `college_scorecard_${now}.xls`;

    this.setState({
      isExporting: true
    }, () => {
      client.downloadFile('/api/college_scorecard/export', {
        outFileName,
        data: {
          columns: collegeScorecardSelectedColumnNames,
          in_filename: fileName,
          out_filename: outFileName
        }
      })
        .then(() => {
          this.setState({
            isExporting: false
          });
        });
    });
  };

  render() {
    const { isExporting } = this.state;
    const {
      isDataFetching,
      isAllDataLoaded,
      collegeScorecardFilesData,
      collegeScorecardData,
      collegeScorecardFetchingError,
      collegeScorecardSelectedData,
      collegeScorecardSelectedOrderedData,
      collegeScorecardSelectedCount,
      collegeScorecardFilters,
      fetchAllData,
      selectData,
      selectAllData,
      unselectData,
      unselectAllData,
      reorderSelectedData
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
          <Grid>
            <Grid.Column width={12}>
              <ColumnsTable
                dataLoaded={isAllDataLoaded}
                data={collegeScorecardData}
                isFetching={isDataFetching}
                fetchingError={collegeScorecardFetchingError}
                selectedData={collegeScorecardSelectedData}
                selectedDataCount={collegeScorecardSelectedCount}
                selectData={selectData}
                unselectData={unselectData}
                columns={columns}
                keyName="dictionary_entry_id"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              {collegeScorecardSelectedCount > 0 && (
                <DragNDrop
                  items={collegeScorecardSelectedOrderedData}
                  reorderItems={reorderSelectedData}
                />
              )}
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment>
          <Button
            size="small"
            disabled={isDataFetching}
            onClick={collegeScorecardSelectedCount < 1 ? selectAllData : unselectAllData}
          >
            {collegeScorecardSelectedCount < 1 ? 'Check All' : `Uncheck All (${collegeScorecardSelectedCount})`}
          </Button>
          <Button
            size="small"
            disabled={isDataFetching}
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
          {collegeScorecardSelectedCount <= SELECTED_LIMIT && (
            <Button
              size="small"
              primary
              loading={isExporting}
              disabled={isDataFetching || collegeScorecardSelectedCount < 1 || isExporting}
              onClick={this.handleExportButton}
            >
              Export
            </Button>
          )}
          {collegeScorecardSelectedCount > SELECTED_LIMIT && (
            <Button
              size="small"
              color="red"
              disabled
            >
              Export
            </Button>
          )}
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
    collegeScorecardData: collegeScorecardReduxModule.selectors.getCollegeScorecardData(state),
    collegeScorecardFetchingError: collegeScorecardReduxModule.selectors.getFetchingError(state),
    collegeScorecardSelectedData: collegeScorecardReduxModule.selectors.getSelected(state),
    collegeScorecardSelectedOrderedData: collegeScorecardReduxModule.selectors.getSelectedOrdered(state),
    collegeScorecardSelectedCount: collegeScorecardReduxModule.selectors.getSelectedCount(state),
    collegeScorecardFilters: collegeScorecardReduxModule.selectors.getFilters(state),
    collegeScorecardSelectedColumnNames: collegeScorecardReduxModule.selectors.getSelectedColumnNames(state)
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
    unselectData: (id, data) => dispatch(collegeScorecardReduxModule.actions.unselect(id, data)),
    unselectAllData: () => dispatch(collegeScorecardReduxModule.actions.unselectAll()),
    setFilters: (key, value) => dispatch(collegeScorecardReduxModule.actions.setFilters(key, value)),
    reorderSelectedData: (sourceIdx, destIdx) =>
      dispatch(collegeScorecardReduxModule.actions.reorder(sourceIdx, destIdx))
  })
)(Reporting));
