import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import { showModal } from 'redux-modal';
import globalCss from 'css/global';
import errorTypeResolution from 'redux/modules/errorTypeResolution';
import withMainLayout from 'components/WithMainLayout';
import ListTable from './ListTable';
import CreateFileModal from './CreateFileModal';
import UpdateFileModal from './UpdateFileModal';

const CREATE_FILE_MODAL = 'CREATE_FILE_MODAL';
const UPDATE_FILE_MODAL = 'UPDATE_FILE_MODAL';

class List extends Component {
  static propTypes = {
    filesFetching: PropTypes.bool.isRequired,
    filesDataLoaded: PropTypes.bool.isRequired,
    filesData: PropTypes.array.isRequired,
    filesFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchFiles: PropTypes.func.isRequired,
    onCreateFileClick: PropTypes.func.isRequired,
    onUpdateFileClick: PropTypes.func.isRequired
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
      filesFetchingError,
      onCreateFileClick,
      onUpdateFileClick
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {__APP_TITLE__} - Error Type Management
          </h1>
        </Segment>
        <Segment>
          <Button primary onClick={onCreateFileClick}>Create Run Book</Button>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={filesFetching}
            dataLoaded={filesDataLoaded}
            data={filesData}
            fetchingError={filesFetchingError}
            onEdit={onUpdateFileClick}
          />
        </Segment>
        <CreateFileModal name={CREATE_FILE_MODAL} />
        <UpdateFileModal name={UPDATE_FILE_MODAL} />
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    filesFetching: state.errorTypeResolution.isFetching,
    filesDataLoaded: state.errorTypeResolution.dataLoaded,
    filesData: errorTypeResolution.selectors.getFiles(state),
    filesFetchingError: errorTypeResolution.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchFiles: () => dispatch(errorTypeResolution.actions.fetchFiles()),
    onCreateFileClick: () => {
      dispatch(showModal(CREATE_FILE_MODAL));
    },
    onUpdateFileClick: (id) => {
      dispatch(errorTypeResolution.actions.updatingFileStart(id));
      dispatch(showModal(UPDATE_FILE_MODAL));
    }
  })
)(List));
