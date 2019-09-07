import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import repsRdx from '../../../redux/modules/telecom/reps';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import ListTable from './ListTable';
import SwitchPageDropdown from '../SwitchPageDropdown';

class Reps extends Component {
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
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA Telecom (Reps)
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isFetching}
            dataLoaded={dataLoaded}
            data={data}
            fetchingError={fetchingError}
          />
        </Segment>
        <Segment>
          <SwitchPageDropdown />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isFetching: state.telecomReps.isFetching,
    dataLoaded: state.telecomReps.dataLoaded,
    data: repsRdx.selectors.getData(state),
    fetchingError: repsRdx.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchData: () => dispatch(repsRdx.actions.fetch()),
    resetData: () => dispatch(repsRdx.actions.reset())
  })
)(Reps));
