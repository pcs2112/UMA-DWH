import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Segment, Button, Grid
} from 'semantic-ui-react';
import collegeScorecardReduxModule from 'redux/modules/collegeScorecard';
import collegeScorecardFilesReduxModule from 'redux/modules/collegeScorecardFiles';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import ColumnsTable from './ColumnsTable';
import FilesDropdownFilter from './FilesDropdownFilter';

class Reporting extends Component {
  static propTypes = {
    collegeScorecardFilesData: PropTypes.array.isRequired,
    isCollegeScorecardFetching: PropTypes.bool.isRequired,
    collegeScorecardDataLoaded: PropTypes.bool.isRequired,
    collegeScorecardData: PropTypes.array.isRequired,
    collegeScorecardFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    collegeScorecardSelectedData: PropTypes.object.isRequired,
    // collegeScorecardSelectedCount: PropTypes.number.isRequired,
    collegeScorecardFilters: PropTypes.object.isRequired,
    fetchCollegeScorecardData: PropTypes.func.isRequired,
    resetCollegeScorecardData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchCollegeScorecardData, collegeScorecardFilters } = this.props;
    const { fileName } = collegeScorecardFilters;
    fetchCollegeScorecardData(fileName);
  }

  componentWillUnmount() {
    const { resetCollegeScorecardData } = this.props;
    resetCollegeScorecardData();
  }

  render() {
    const {
      collegeScorecardFilesData,
      collegeScorecardDataLoaded,
      collegeScorecardData,
      isCollegeScorecardFetching,
      collegeScorecardFetchingError,
      collegeScorecardSelectedData,
      collegeScorecardFilters,
      fetchCollegeScorecardData,
      selectData,
      unselectData
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
                onChange={fetchCollegeScorecardData}
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
            selectData={selectData}
            unselectData={unselectData}
          />
        </Segment>
        <Segment>
          <Button primary>Export</Button>
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
    fetchCollegeScorecardData: fileName => dispatch(collegeScorecardReduxModule.actions.fetch(fileName)),
    resetCollegeScorecardData: () => {
      dispatch(collegeScorecardReduxModule.actions.reset());
    },
    selectData: (id, data) => dispatch(collegeScorecardReduxModule.actions.select(id, data)),
    unselectData: id => dispatch(collegeScorecardReduxModule.actions.unselect(id))
  })
)(Reporting));
