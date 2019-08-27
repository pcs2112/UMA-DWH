import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import globalCss from 'css/global';
import withMainLayout from 'components/WithMainLayout';
import telecomSkills from 'redux/modules/telecomSkills';
import ListTable from './ListTable';

class List extends Component {
  static propTypes = {
    filesFetching: PropTypes.bool.isRequired,
    filesDataLoaded: PropTypes.bool.isRequired,
    filesData: PropTypes.array.isRequired,
    filesFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchFiles: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { filesFetching, filesDataLoaded, fetchFiles } = this.props;
    if (!filesFetching && !filesDataLoaded) {
      fetchFiles();
    }
  }

  render() {
    const {
      filesFetching,
      filesDataLoaded,
      filesData,
      filesFetchingError
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
           UMA Telecom
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={filesFetching}
            dataLoaded={filesDataLoaded}
            data={filesData}
            fetchingError={filesFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    filesFetching: state.errorTypeResolution.isFetching,
    filesDataLoaded: state.errorTypeResolution.dataLoaded,
    filesData: telecomSkills.selectors.getFiles(state),
    filesFetchingError: telecomSkills.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchFiles: () => dispatch(telecomSkills.actions.fetchFiles()),
  })
)(List));
