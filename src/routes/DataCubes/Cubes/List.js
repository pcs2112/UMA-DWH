import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import ListTable from './ListTable';
import CubeForm from './CubeForm';
import globalCss from '../../../css/global';

class List extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  render() {
    const {
      isFetching,
      dataLoaded,
      data,
      fetchingError
    } = this.props;
    return (
      <Fragment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isFetching}
            dataLoaded={dataLoaded}
            data={data}
            fetchingError={fetchingError}
          />
        </Segment>
        <Segment>
          <CubeForm />
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
    fetchingError: cubesRdx.selectors.getFetchingError(state)
  }),
  null
)(List);
