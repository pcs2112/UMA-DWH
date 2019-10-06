import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import List from './List';

class Cubes extends Component {
  static propTypes = {
    isCubesFetching: PropTypes.bool.isRequired,
    cubesLoaded: PropTypes.bool.isRequired,
    cubes: PropTypes.array.isRequired,
    cubesFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchData: PropTypes.func.isRequired
    // resetData: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      view: 'list'
    };
  }

  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  componentWillUnmount() {
    // const { resetData } = this.props;
    // resetData();
  }

  render() {
    const {
      isCubesFetching,
      cubesLoaded,
      cubes,
      cubesFetchingError
    } = this.props;
    const { view } = this.state;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA Data Cubes
          </h1>
        </Segment>
        {view === 'list' && (
          <List
            isFetching={isCubesFetching}
            dataLoaded={cubesLoaded}
            data={cubes}
            fetchingError={cubesFetchingError}
          />
        )}
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isCubesFetching: state.dataCubes.isFetching,
    cubesLoaded: state.dataCubes.dataLoaded,
    cubes: cubesRdx.selectors.getData(state),
    cubesFetchingError: cubesRdx.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchData: () => dispatch(cubesRdx.actions.fetch()),
    resetData: () => dispatch(cubesRdx.actions.reset())
  })
)(Cubes));
