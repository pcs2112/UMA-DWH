import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset, getFormValues } from 'redux-form';
import { Segment, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import { showModal, hideModal } from 'redux-modal';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import factsRdx from '../../../redux/modules/dataCubes/facts';
import dimsRdx from '../../../redux/modules/dataCubes/dims';
import ListTable from './ListTable';
import CubeForm from './CubeForm';
import DefinitionForm from './DefinitionForm';
import ScheduleCubeForm from './ScheduleCubeForm';
import globalCss from '../../../css/global';

const CUBE_FORM = 'CubeForm';
const SCHEDULE_CUBE_MODAL = 'ScheduleCubeModal';
const DEFINITION_CUBE_MODAL = 'DefinitionCubeModal';

class List extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    cubeFormInitialValues: PropTypes.object.isRequired,
    cubeFormValues: PropTypes.object.isRequired,
    onCubeEdit: PropTypes.func.isRequired,
    onCubeFormCancel: PropTypes.func.isRequired,
    scheduleOpen: PropTypes.bool.isRequired,
    onSchedule: PropTypes.func.isRequired,
    onScheduleClose: PropTypes.func.isRequired,
    definitionOpen: PropTypes.bool.isRequired,
    onDefinition: PropTypes.func.isRequired,
    onDefinitionClose: PropTypes.func.isRequired,
    facts: PropTypes.array.isRequired,
    selectedFacts: PropTypes.object.isRequired,
    onAddFact: PropTypes.func.isRequired,
    onRemoveFact: PropTypes.func.isRequired,
    onRemoveAllFacts: PropTypes.func.isRequired,
    dims: PropTypes.array.isRequired,
    selectedDims: PropTypes.array.isRequired,
    onAddDim: PropTypes.func.isRequired,
    onRemoveDim: PropTypes.func.isRequired,
    onRemoveAllDims: PropTypes.func.isRequired
  };

  render() {
    const {
      isFetching,
      dataLoaded,
      data,
      fetchingError,
      cubeFormInitialValues,
      cubeFormValues,
      onCubeEdit,
      onCubeFormCancel,
      scheduleOpen,
      onSchedule,
      onScheduleClose,
      definitionOpen,
      onDefinition,
      onDefinitionClose,
      facts,
      selectedFacts,
      onAddFact,
      onRemoveFact,
      onRemoveAllFacts,
      dims,
      selectedDims,
      onAddDim,
      onRemoveDim,
      onRemoveAllDims
    } = this.props;
    return (
      <Fragment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isFetching}
            dataLoaded={dataLoaded}
            data={data}
            fetchingError={fetchingError}
            onEdit={onCubeEdit}
          />
        </Segment>
        <Segment>
          <CubeForm
            form={CUBE_FORM}
            initialValues={cubeFormInitialValues}
            destroyOnUnmount={false}
            forceUnregisterOnUnmount
            isNewRecord={!cubeFormInitialValues.id}
            onSubmit={() => {}}
            onCancel={onCubeFormCancel}
            onDefinition={onDefinition}
            definitionDisabled={!_.get(cubeFormValues, 'cube_name')}
            onSchedule={onSchedule}
            scheduleDisabled={!_.get(cubeFormValues, 'cube_name')}
          />
        </Segment>
        <Modal
          open={scheduleOpen}
          onClose={onScheduleClose}
          closeIcon
          dimmer="inverted"
          closeOnDimmerClick={false}
        >
          <Modal.Header content={<h1>SCHEDULE CUBE</h1>} />
          <Modal.Content>
            <ScheduleCubeForm
              form={CUBE_FORM}
              initialValues={cubeFormInitialValues}
              destroyOnUnmount={false}
              forceUnregisterOnUnmount
              onClose={onScheduleClose}
            />
          </Modal.Content>
        </Modal>
        <Modal
          open={definitionOpen}
          onClose={onDefinitionClose}
          closeIcon
          dimmer="inverted"
          closeOnDimmerClick={false}
        >
          <Modal.Header content={<h1>DEFINE CUBE</h1>} />
          <Modal.Content>
            <DefinitionForm
              facts={facts}
              selectedFacts={selectedFacts}
              onAddFact={onAddFact}
              onRemoveFact={onRemoveFact}
              onRemoveAllFacts={onRemoveAllFacts}
              dims={dims}
              selectedDims={selectedDims}
              onAddDim={onAddDim}
              onRemoveDim={onRemoveDim}
              onRemoveAllDims={onRemoveAllDims}
            />
          </Modal.Content>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    isFetching: state.dataLakeEntries.isFetching,
    dataLoaded: state.dataLakeEntries.dataLoaded,
    data: cubesRdx.selectors.getData(state),
    fetchingError: cubesRdx.selectors.getFetchingError(state),
    cubeFormInitialValues: cubesRdx.selectors.getCubeFormInitialValues(state),
    cubeFormValues: getFormValues(CUBE_FORM)(state) || {},
    scheduleOpen: state.modal.modalName === SCHEDULE_CUBE_MODAL,
    definitionOpen: state.modal.modalName === DEFINITION_CUBE_MODAL,
    facts: factsRdx.selectors.getData(state),
    selectedFacts: factsRdx.selectors.getSelected(state),
    dims: dimsRdx.selectors.getData(state),
    selectedDims: dimsRdx.selectors.getSelected(state)
  }),
  dispatch => ({
    onCubeEdit: (id) => {
      dispatch(cubesRdx.actions.fetchSchedule(id))
        .then(() => dispatch(cubesRdx.actions.updatingStart(id)));
    },
    onCubeFormCancel: () => {
      dispatch(cubesRdx.actions.updatingEnd());
      dispatch(reset(CUBE_FORM));
    },
    onSchedule: () => {
      dispatch(showModal(SCHEDULE_CUBE_MODAL));
    },
    onScheduleClose: () => {
      dispatch(hideModal(SCHEDULE_CUBE_MODAL));
    },
    onDefinition: () => {
      dispatch(showModal(DEFINITION_CUBE_MODAL));
    },
    onDefinitionClose: () => {
      dispatch(hideModal(DEFINITION_CUBE_MODAL));
    },
    onAddFact: (fact) => {
      dispatch(factsRdx.actions.select(fact));
    },
    onRemoveFact: (id, fact) => {
      dispatch(factsRdx.actions.unselect(id, fact));
    },
    onRemoveAllFacts: () => {
      dispatch(factsRdx.actions.unselectAll());
    },
    onAddDim: (dim) => {
      dispatch(dimsRdx.actions.select(dim));
    },
    onRemoveDim: (id, dim) => {
      dispatch(dimsRdx.actions.unselect(id, dim));
    },
    onRemoveAllDims: () => {
      dispatch(dimsRdx.actions.unselectAll());
    }
  })
)(List);