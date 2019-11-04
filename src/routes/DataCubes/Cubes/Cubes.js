import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import factsRdx from '../../../redux/modules/dataCubes/facts';
import dimsRdx from '../../../redux/modules/dataCubes/dims';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import List from './List';

class Cubes extends Component {
  static propTypes = {
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
    const { view } = this.state;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA Data Cubes
          </h1>
        </Segment>
        {view === 'list' && (
          <List />
        )}
      </div>
    );
  }
}

export default withMainLayout(connect(
  null,
  dispatch => ({
    fetchData: () => {
      Promise.all([
        dispatch(cubesRdx.actions.fetch()),
        dispatch(factsRdx.actions.fetch()),
        dispatch(dimsRdx.actions.fetch())
      ]);
    },
    resetData: () => {
      dispatch(cubesRdx.actions.reset());
      dispatch(factsRdx.actions.reset());
      dispatch(dimsRdx.actions.reset());
    }
  })
)(Cubes));
