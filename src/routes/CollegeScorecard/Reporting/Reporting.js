import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import { showModal as showModalAction } from 'redux-modal';
import { isEmpty } from 'javascript-utils/lib/utils';
import { client } from '../../../helpers/ApiClient';
import collegeScorecardRDX from '../../../redux/modules/collegeScorecard';
import collegeScorecardFilesRDX from '../../../redux/modules/collegeScorecardFiles';
import collegeScorecardGroupsRDX from '../../../redux/modules/collegeScorecardGroups';
import collegeScorecardReportsRDX from '../../../redux/modules/collegeScorecardReports';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import Filters from './Filters';
import VirtualTable from '../VirtualTable';
import VirtualSortableList from '../VirtualSortableList';
import CreateReportModal from '../CreateReportModal';
import UpdateReportModal from '../UpdateReportModal';
import DropdownFilter from '../../../components/DropdownFilter';
import columns from './columns';
import styles from './styles.less';

const SELECTED_LIMIT = 255;
const CREATE_REPORT_MODAL = 'CREATE_REPORT_MODAL';
const UPDATE_REPORT_MODAL = 'UPDATE_REPORT_MODAL';

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
    collegeScorecardSelectedColumnNames: PropTypes.array.isRequired,
    collegeScorecardReportsData: PropTypes.array.isRequired,
    collegeScorecardCurrentReport: PropTypes.object,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    selectAllData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    unselectAllData: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    reorderSelectedData: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    fetchReport: PropTypes.func.isRequired
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

  handleShowModal = (e, { modalname }) => {
    const { showModal } = this.props;
    showModal(modalname);
  };

  getPageTitle = () => {
    const { collegeScorecardCurrentReport } = this.props;
    let pageTitle = 'College Scorecard Reporting';
    if (collegeScorecardCurrentReport) {
      pageTitle += ` (${collegeScorecardCurrentReport.report_name})`;
    }

    return pageTitle;
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
      collegeScorecardReportsData,
      collegeScorecardCurrentReport,
      fetchAllData,
      selectData,
      selectAllData,
      unselectData,
      unselectAllData,
      reorderSelectedData,
      fetchReport,
      setFilters
    } = this.props;

    const currentReportId = collegeScorecardCurrentReport ? collegeScorecardCurrentReport.id : '';
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {this.getPageTitle()}
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={5}>
              <Filters
                fileOptions={collegeScorecardFilesData}
                onQueryChange={setFilters}
                onFileChange={fetchAllData}
                {...collegeScorecardFilters}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <Grid>
            <Grid.Column width={12}>
              <VirtualTable
                dataLoaded={isAllDataLoaded}
                data={collegeScorecardData}
                isFetching={isDataFetching}
                fetchingError={collegeScorecardFetchingError}
                selectedData={collegeScorecardSelectedData}
                selectedDataCount={collegeScorecardSelectedCount}
                selectData={selectData}
                unselectData={unselectData}
                columns={columns}
                keyName={collegeScorecardRDX.constants.LIST_ITEM_KEY_NAME}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <div className={styles.RightColumn}>
                <DropdownFilter
                  options={collegeScorecardReportsData}
                  defaultValue={currentReportId}
                  placeholder="Select a report"
                  onChange={fetchReport}
                  className={styles.RightColumnButtons}
                  disabled={collegeScorecardReportsData.length < 1}
                />
                <Button
                  fluid
                  size="small"
                  primary
                  onClick={this.handleShowModal}
                  modalname={UPDATE_REPORT_MODAL}
                  className={styles.RightColumnButtons}
                  disabled={
                    collegeScorecardReportsData.length < 1 || !currentReportId || collegeScorecardSelectedCount < 1
                  }
                >
                  Save Report
                </Button>
                <Button
                  fluid
                  size="small"
                  color="green"
                  onClick={this.handleShowModal}
                  modalname={CREATE_REPORT_MODAL}
                  className={styles.RightColumnButtons}
                  disabled={collegeScorecardSelectedCount < 1}
                >
                  Save New Report
                </Button>
                {collegeScorecardSelectedCount > 0 && (
                  <VirtualSortableList
                    containerWidth={220}
                    items={collegeScorecardSelectedOrderedData}
                    itemValueKeyName="column_name"
                    onSortEnd={reorderSelectedData}
                  />
                )}
              </div>
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
        <CreateReportModal
          name={CREATE_REPORT_MODAL}
        />
        <UpdateReportModal
          name={UPDATE_REPORT_MODAL}
        />
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isDataFetching: state.collegeScorecard.isFetching
      || state.collegeScorecardGroups.isFetching
      || state.collegeScorecardReports.isFetching,
    isAllDataLoaded: state.collegeScorecard.dataLoaded
      && state.collegeScorecardGroups.dataLoaded
      && state.collegeScorecardReports.dataLoaded,
    collegeScorecardFilesData: collegeScorecardFilesRDX.selectors
      .getCollegeScorecardFilesDropdownOptions(state),
    collegeScorecardData: collegeScorecardRDX.selectors.getCollegeScorecardData(state),
    collegeScorecardFetchingError: collegeScorecardRDX.selectors.getFetchingError(state),
    collegeScorecardSelectedData: collegeScorecardRDX.selectors.getSelected(state),
    collegeScorecardSelectedOrderedData: collegeScorecardRDX.selectors.getSelectedOrdered(state),
    collegeScorecardSelectedCount: collegeScorecardRDX.selectors.getSelectedCount(state),
    collegeScorecardFilters: collegeScorecardRDX.selectors.getFilters(state),
    collegeScorecardSelectedColumnNames: collegeScorecardRDX.selectors.getSelectedColumnNames(state),
    collegeScorecardReportsData: collegeScorecardReportsRDX.selectors
      .getCollegeScorecardReportsDropdownOptions(state),
    collegeScorecardCurrentReport: collegeScorecardReportsRDX.selectors.getCurrentReport(state)
  }),
  dispatch => ({
    fetchAllData: fileName => Promise.all([
      dispatch(collegeScorecardRDX.actions.fetch(fileName)),
      dispatch(collegeScorecardGroupsRDX.actions.fetch(fileName)),
      dispatch(collegeScorecardReportsRDX.actions.fetch())
    ]),
    resetAllData: () => {
      dispatch(collegeScorecardRDX.actions.reset());
      dispatch(collegeScorecardGroupsRDX.actions.reset());
      dispatch(collegeScorecardReportsRDX.actions.reset());
    },
    selectData: data => dispatch(collegeScorecardRDX.actions.select(data)),
    selectAllData: () => dispatch(collegeScorecardRDX.actions.selectAll()),
    unselectData: (id, data) => dispatch(collegeScorecardRDX.actions.unselect(id, data)),
    unselectAllData: () => {
      dispatch(collegeScorecardRDX.actions.unselectAll());
      dispatch(collegeScorecardReportsRDX.actions.resetReport());
    },
    setFilters: (key, value) => dispatch(collegeScorecardRDX.actions.setFilters(key, value)),
    reorderSelectedData: (sourceIdx, destIdx) =>
      dispatch(collegeScorecardRDX.actions.reorder(sourceIdx, destIdx)),
    showModal: modalName => dispatch(showModalAction(modalName)),
    fetchReport: (id) => {
      if (isEmpty(id)) {
        dispatch(collegeScorecardRDX.actions.unselectAll());
        dispatch(collegeScorecardReportsRDX.actions.resetReport());
      } else {
        dispatch(collegeScorecardReportsRDX.actions.fetchReport(id))
          .then(report => dispatch(collegeScorecardRDX.actions.loadSavedReport(report)));
      }
    }
  })
)(Reporting));
