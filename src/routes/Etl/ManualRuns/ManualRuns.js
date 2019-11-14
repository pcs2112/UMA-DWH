import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import manualRunsRdx from '../../../redux/modules/etl/manualRuns';
import ListTable from './ListTable';
import ManuaRunForm from './ManuaRunForm';
import Filters from './Filters';

const MANUAL_RUN_FORM = 'ManualRunForm';

class ManualRuns extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    manualRunFormInitialValues: PropTypes.object.isRequired,
    isClearingAll: PropTypes.bool.isRequired,
    fetchData: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    onManualRunEdit: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  render() {
    const {
      isFetching,
      dataLoaded,
      data,
      fetchingError,
      manualRunFormInitialValues,
      isClearingAll,
      fetchData,
      clearAll,
      onManualRunEdit
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA ETL Manual Runs
          </h1>
        </Segment>
        <Segment>
          <Filters />
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isFetching}
            dataLoaded={dataLoaded}
            data={data}
            fetchingError={fetchingError}
            onEdit={onManualRunEdit}
          />
        </Segment>
        <Segment clearing>
          <Button
            size="small"
            floated="right"
            disabled={isClearingAll || isFetching}
            onClick={clearAll}
          >
            Clear All
          </Button>
          <Button
            size="small"
            floated="right"
            disabled={isFetching}
            onClick={fetchData}
          >
            Reload
          </Button>
        </Segment>
        <Segment>
          <ManuaRunForm
            form={MANUAL_RUN_FORM}
            initialValues={manualRunFormInitialValues}
            enableReinitialize
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isFetching: state.etlManualRuns.isFetching,
    dataLoaded: state.etlManualRuns.dataLoaded,
    data: manualRunsRdx.selectors.getData(state),
    fetchingError: manualRunsRdx.selectors.getFetchingError(state),
    manualRunFormInitialValues: manualRunsRdx.selectors.getManualRunFormInitialValues(state),
    isClearingAll: state.etlManualRuns.isClearingAll
  }),
  dispatch => ({
    fetchData: () => dispatch(manualRunsRdx.actions.fetch()),
    clearAll: () => {
      dispatch(manualRunsRdx.actions.clearAll());
      dispatch(manualRunsRdx.actions.fetch());
    },
    onManualRunEdit: (id) => {
      dispatch(manualRunsRdx.actions.updatingStart(id));
    }
  })
)(ManualRuns));
