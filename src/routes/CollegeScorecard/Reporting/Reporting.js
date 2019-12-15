import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import { showModal as showModalAction } from 'redux-modal';
import { isEmpty } from 'javascript-utils/lib/utils';
import { client } from '../../../helpers/ApiClient';
import collegeScorecardRdx from '../../../redux/modules/collegeScorecard';
import collegeScorecardFilesRdx from '../../../redux/modules/collegeScorecardFiles';
import collegeScorecardGroupsRdx from '../../../redux/modules/collegeScorecardGroups';
import collegeScorecardReportsRdx from '../../../redux/modules/collegeScorecardReports';
import withMainLayout from '../../../components/WithMainLayout';
import withResponsiveContainer from '../../../components/WithResponsiveContainer';
import CheckboxVirtualTable from '../../../components/CheckboxVirtualTable';
import withVirtualSortableList from '../../../components/WithVirtualSortableList';
import PageHeader from '../../../components/PageHeader';
import globalCss from '../../../css/global';
import Filters from './Filters';
import ColumnsSortableList from '../ColumnsSortableList';
import CreateReportModal from '../CreateReportModal';
import UpdateReportModal from '../UpdateReportModal';
import SaveReportTableModal from '../SaveReportTableModal';
import DropdownFilter from '../../../components/DropdownFilter';
import columns from './columns';
import styles from './styles.less';

const SELECTED_LIMIT = 1024;
const CREATE_REPORT_MODAL = 'CREATE_REPORT_MODAL';
const UPDATE_REPORT_MODAL = 'UPDATE_REPORT_MODAL';
const SAVE_REPORT_TABLE_MODAL = 'SAVE_REPORT_TABLE_MODAL';
const Table = withResponsiveContainer(CheckboxVirtualTable, 320, 300);
const ColumnsList = withResponsiveContainer(withVirtualSortableList(ColumnsSortableList), 205, 440);

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
    selectDefaultData: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    autoReorderSelectedData: PropTypes.func.isRequired,
    reorderSelectedData: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    fetchReport: PropTypes.func.isRequired,
    saveUmaColumnTitle: PropTypes.func.isRequired
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
    const { setFilter, collegeScorecardFilters } = this.props;
    const { populated } = collegeScorecardFilters;
    const newPopulated = populated === '' ? 'ALL' : '';
    setFilter('populated', newPopulated);
  };

  handleExportButton = () => {
    const { collegeScorecardSelectedColumnNames, collegeScorecardFilters } = this.props;
    const { fileName } = collegeScorecardFilters;
    const now = Math.floor(Date.now() / 1000);

    let outFileName = fileName.split('.').slice(0, -1).join('.');
    outFileName = `${outFileName}_${now}.xlsx`;

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
      selectDefaultData,
      autoReorderSelectedData,
      reorderSelectedData,
      fetchReport,
      setFilter,
      saveUmaColumnTitle
    } = this.props;

    const currentReportId = collegeScorecardCurrentReport ? collegeScorecardCurrentReport.id : '';
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <PageHeader
            headerText={this.getPageTitle()}
            state={collegeScorecardCurrentReport && collegeScorecardCurrentReport.hasChanged ? 'error' : ''}
          />
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={8}>
              <Filters
                fileOptions={collegeScorecardFilesData}
                onQueryChange={setFilter}
                onFileChange={fetchAllData}
                {...collegeScorecardFilters}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <Grid>
            <Grid.Column width={12}>
              <Table
                dataLoaded={isAllDataLoaded}
                data={collegeScorecardData}
                isFetching={isDataFetching}
                fetchingError={collegeScorecardFetchingError}
                selectedData={collegeScorecardSelectedData}
                selectedDataCount={collegeScorecardSelectedCount}
                selectData={selectData}
                unselectData={unselectData}
                columns={columns}
                keyName={collegeScorecardRdx.constants.LIST_ITEM_KEY_NAME}
                onCellChange={saveUmaColumnTitle}
              />
            </Grid.Column>
            <Grid.Column width={4}>
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
                  <Fragment>
                    <ColumnsList
                      containerWidth={260}
                      items={collegeScorecardSelectedOrderedData}
                      itemValueKeyName="column_name"
                      onSortEnd={reorderSelectedData}
                    />
                    <Button
                      fluid
                      size="small"
                      primary
                      className={styles.RightColumnButtons}
                      disabled={collegeScorecardSelectedCount < 2}
                      onClick={autoReorderSelectedData}
                    >
                      Reorder columns
                    </Button>
                  </Fragment>
                )}
              </div>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment>
          <Button
            size="small"
            disabled={isDataFetching || isExporting}
            onClick={collegeScorecardSelectedCount < 1 ? selectAllData : unselectAllData}
          >
            {collegeScorecardSelectedCount < 1 ? 'Check All' : `Uncheck All (${collegeScorecardSelectedCount})`}
          </Button>
          <Button
            size="small"
            disabled={isDataFetching || isExporting}
            onClick={this.handleViewFilterButton}
          >
            {collegeScorecardFilters.populated === '' ? 'View All' : 'View Populated'}
          </Button>
          <Button
            size="small"
            disabled={isDataFetching || isExporting}
            onClick={selectDefaultData}
          >
            Select Default
          </Button>
          <Button
            size="small"
            as={Link}
            to="/college_scorecard/groups"
            disabled={isDataFetching || isExporting}
          >
            Groups
          </Button>
          <Button
            size="small"
            as={Link}
            to="/college_scorecard/categories"
            disabled={isDataFetching || isExporting}
          >
            Categories
          </Button>
          <Button
            size="small"
            as={Link}
            to="/college_scorecard/tasks"
            disabled={isDataFetching || isExporting}
          >
           Tasks
          </Button>
          <Button
            size="small"
            primary
            loading={isExporting}
            disabled={
              isDataFetching
              || isExporting
              || collegeScorecardSelectedCount < 1
              || (collegeScorecardCurrentReport && collegeScorecardCurrentReport.hasChanged)
            }
            onClick={this.handleExportButton}
          >
            Export
          </Button>
          <Button
            size="small"
            color="green"
            onClick={this.handleShowModal}
            modalname={SAVE_REPORT_TABLE_MODAL}
            disabled={
              isDataFetching
              || isExporting
              || !collegeScorecardCurrentReport
              || collegeScorecardSelectedCount > SELECTED_LIMIT
              || collegeScorecardCurrentReport.hasChanged
            }
          >
            Save to Table
          </Button>
        </Segment>
        <CreateReportModal
          name={CREATE_REPORT_MODAL}
        />
        <UpdateReportModal
          name={UPDATE_REPORT_MODAL}
        />
        <SaveReportTableModal
          name={SAVE_REPORT_TABLE_MODAL}
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
    collegeScorecardFilesData: collegeScorecardFilesRdx.selectors
      .getCollegeScorecardFilesDropdownOptions(state),
    collegeScorecardData: collegeScorecardRdx.selectors.getCollegeScorecardData(state),
    collegeScorecardFetchingError: collegeScorecardRdx.selectors.getFetchingError(state),
    collegeScorecardSelectedData: collegeScorecardRdx.selectors.getSelected(state),
    collegeScorecardSelectedOrderedData: collegeScorecardRdx.selectors.getSelectedOrdered(state),
    collegeScorecardSelectedCount: collegeScorecardRdx.selectors.getSelectedCount(state),
    collegeScorecardFilters: collegeScorecardRdx.selectors.getFilters(state),
    collegeScorecardSelectedColumnNames: collegeScorecardRdx.selectors.getSelectedColumnNames(state),
    collegeScorecardReportsData: collegeScorecardReportsRdx.selectors
      .getCollegeScorecardReportsDropdownOptions(state),
    collegeScorecardCurrentReport: collegeScorecardReportsRdx.selectors.getCurrentReport(state)
  }),
  dispatch => ({
    fetchAllData: fileName => Promise.all([
      dispatch(collegeScorecardRdx.actions.fetch(fileName)),
      dispatch(collegeScorecardGroupsRdx.actions.fetch(fileName)),
      dispatch(collegeScorecardReportsRdx.actions.fetch())
    ]),
    resetAllData: () => {
      dispatch(collegeScorecardRdx.actions.reset());
      dispatch(collegeScorecardGroupsRdx.actions.reset());
      dispatch(collegeScorecardReportsRdx.actions.reset());
    },
    selectData: data => dispatch(collegeScorecardRdx.actions.select(data)),
    selectAllData: () => dispatch(collegeScorecardRdx.actions.selectAll()),
    unselectData: (id, data) => dispatch(collegeScorecardRdx.actions.unselect(id, data)),
    unselectAllData: () => {
      dispatch(collegeScorecardRdx.actions.unselectAll());
      dispatch(collegeScorecardReportsRdx.actions.resetReport());
    },
    selectDefaultData: () => dispatch(collegeScorecardRdx.actions.selectDefault()),
    setFilter: (key, value) => dispatch(collegeScorecardRdx.actions.setFilter(key, value)),
    autoReorderSelectedData: () => dispatch(collegeScorecardRdx.actions.autoReorder()),
    reorderSelectedData: (sourceIdx, destIdx) =>
      dispatch(collegeScorecardRdx.actions.reorder(sourceIdx, destIdx)),
    showModal: modalName => dispatch(showModalAction(modalName)),
    fetchReport: (id) => {
      if (isEmpty(id)) {
        dispatch(collegeScorecardRdx.actions.unselectAll());
        dispatch(collegeScorecardReportsRdx.actions.resetReport());
      } else {
        dispatch(collegeScorecardReportsRdx.actions.fetchReport(id))
          .then(report => dispatch(collegeScorecardRdx.actions.loadSavedReport(report)));
      }
    },
    saveUmaColumnTitle: (columnIndex, columnName, newColumnName) =>
      dispatch(collegeScorecardRdx.actions.saveUmaColumnTitle(columnIndex, columnName, newColumnName))
  })
)(Reporting));
