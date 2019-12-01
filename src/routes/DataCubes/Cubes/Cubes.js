import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { Segment, Modal, Header } from 'semantic-ui-react';
import _ from 'lodash';
import { showModal, hideModal } from 'redux-modal';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import factsRdx from '../../../redux/modules/dataCubes/facts';
import dimsRdx from '../../../redux/modules/dataCubes/dims';
import withMainLayout from '../../../components/WithMainLayout';
import ListTable from './ListTable';
import CubeForm from './CubeForm';
import DefinitionForm from './DefinitionForm';
import ScheduleCubeForm from './ScheduleCubeForm';
import globalCss from '../../../css/global';
import {
  CUBE_FORM, CUBE_SCHEDULE_FORM, SCHEDULE_CUBE_MODAL, DEFINITION_CUBE_MODAL
} from './constants';

class Cubes extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchData: PropTypes.func.isRequired,
    cubeFormInitialValues: PropTypes.object.isRequired,
    cubeFormValues: PropTypes.object.isRequired,
    onCubeEdit: PropTypes.func.isRequired,
    scheduleOpen: PropTypes.bool.isRequired,
    onSchedule: PropTypes.func.isRequired,
    onScheduleClose: PropTypes.func.isRequired,
    definitionOpen: PropTypes.bool.isRequired,
    onDefinition: PropTypes.func.isRequired,
    onDefinitionClose: PropTypes.func.isRequired
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
      cubeFormInitialValues,
      cubeFormValues,
      onCubeEdit,
      scheduleOpen,
      onSchedule,
      onScheduleClose,
      definitionOpen,
      onDefinition,
      onDefinitionClose
    } = this.props;
    return (
      <Fragment>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA Data Cubes
          </h1>
        </Segment>
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
          <Header as="h3" dividing>
            {cubeFormInitialValues && cubeFormInitialValues.id ? 'UPDATE CUBE' : 'CREATE A NEW CUBE'}
          </Header>
          <CubeForm
            form={CUBE_FORM}
            initialValues={cubeFormInitialValues}
            enableReinitialize
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
              form={CUBE_SCHEDULE_FORM}
              initialValues={cubeFormInitialValues.schedule}
              enableReinitialize
              destroyOnUnmount={false}
              keepDirtyOnReinitialize
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
              form={CUBE_FORM}
              onClose={onDefinitionClose}
            />
          </Modal.Content>
        </Modal>
      </Fragment>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isFetching: state.dataLakeEntries.isFetching,
    dataLoaded: state.dataLakeEntries.dataLoaded,
    data: cubesRdx.selectors.getData(state),
    fetchingError: cubesRdx.selectors.getFetchingError(state),
    cubeFormInitialValues: cubesRdx.selectors.getCubeFormInitialValues(state),
    cubeFormValues: getFormValues(CUBE_FORM)(state) || {},
    scheduleOpen: state.modal.modalName === SCHEDULE_CUBE_MODAL,
    definitionOpen: state.modal.modalName === DEFINITION_CUBE_MODAL
  }),
  dispatch => ({
    fetchData: () => {
      Promise.all([
        dispatch(cubesRdx.actions.fetch()),
        dispatch(factsRdx.actions.fetch()),
        dispatch(dimsRdx.actions.fetch())
      ]);
    },
    onCubeEdit: (id) => dispatch(cubesRdx.actions.fetchSchedule(id))
      .then(() => Promise.resolve(dispatch(cubesRdx.actions.updatingStart(id))))
      .then(() => Promise.resolve(dispatch(factsRdx.actions.initSelected()))),
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
    }
  })
)(Cubes));
