import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';

class Cubes extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchData: PropTypes.func.isRequired,
    resetData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  componentWillUnmount() {
    const { resetData } = this.props;
    resetData();
  }

  render() {
    const {
      isFetching,
      dataLoaded,
      data,
      fetchingError
    } = this.props;
    console.log(isFetching, dataLoaded, data, fetchingError);
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA Data Cubes
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          Test
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isFetching: state.dataLakeEntries.isFetching,
    dataLoaded: state.dataLakeEntries.dataLoaded,
    data: cubesRdx.selectors.getData(state),
    fetchingError: cubesRdx.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchData: () => dispatch(cubesRdx.actions.fetch()),
    resetData: () => dispatch(cubesRdx.actions.reset())
  })
)(Cubes));
