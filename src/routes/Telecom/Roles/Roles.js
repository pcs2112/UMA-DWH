import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import rolesRdx from '../../../redux/modules/telecom/roles';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import ListTable from './ListTable';
import SwitchPageDropdown from '../SwitchPageDropdown';

class Roles extends Component {
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
            UMA Telecom (Roles)
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
    data: rolesRdx.selectors.getData(state),
    fetchingError: rolesRdx.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchData: () => dispatch(rolesRdx.actions.fetch()),
    resetData: () => dispatch(rolesRdx.actions.reset())
  })
)(Roles));
