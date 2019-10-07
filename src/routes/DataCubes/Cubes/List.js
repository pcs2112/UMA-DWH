import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { Segment } from 'semantic-ui-react';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import ListTable from './ListTable';
import CubeForm from './CubeForm';
import globalCss from '../../../css/global';

const CUBE_FORM = 'CubesForm';

class List extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    cubeFormInitialValues: PropTypes.object,
    onCubeEdit: PropTypes.func.isRequired,
    onCubeFormCancel: PropTypes.func.isRequired
  };

  render() {
    const {
      isFetching,
      dataLoaded,
      data,
      fetchingError,
      cubeFormInitialValues,
      onCubeEdit,
      onCubeFormCancel
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
            enableReinitialize
            isNewRecord={!cubeFormInitialValues.id}
            onSubmit={() => {}}
            onCancel={onCubeFormCancel}
          />
        </Segment>
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
  }),
  dispatch => ({
    onCubeEdit: id => dispatch(cubesRdx.actions.updatingStart(id)),
    onCubeFormCancel: () => {
      dispatch(cubesRdx.actions.updatingEnd());
      dispatch(reset(CUBE_FORM));
    }
  })
)(List);
