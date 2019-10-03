import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import { showModal } from 'redux-modal';
import entriesRdx from '../../../redux/modules/dataLake/entries';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import ListTable from './ListTable';
import CreateEntryModal from './CreateEntryModal';
import UpdateEntryModal from './UpdateEntryModal';

const CREATE_ENTRY_MODAL = 'CREATE_ENTRY_MODAL';
const UPDATE_ENTRY_MODAL = 'UPDATE_ENTRY_MODAL';

class Entries extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchData: PropTypes.func.isRequired,
    resetData: PropTypes.func.isRequired,
    onCreateEntryClick: PropTypes.func.isRequired,
    onUpdateEntryClick: PropTypes.func.isRequired
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
      fetchingError,
      onCreateEntryClick,
      onUpdateEntryClick
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA Data Lake
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isFetching}
            dataLoaded={dataLoaded}
            data={data}
            fetchingError={fetchingError}
            onEdit={onUpdateEntryClick}
          />
        </Segment>
        <Segment>
          <Button primary onClick={onCreateEntryClick}>Create</Button>
        </Segment>
        <CreateEntryModal
          name={CREATE_ENTRY_MODAL}
        />
        <UpdateEntryModal
          name={UPDATE_ENTRY_MODAL}
        />
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isFetching: state.dataLakeEntries.isFetching,
    dataLoaded: state.dataLakeEntries.dataLoaded,
    data: entriesRdx.selectors.getData(state),
    fetchingError: entriesRdx.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchData: () => dispatch(entriesRdx.actions.fetch()),
    resetData: () => dispatch(entriesRdx.actions.reset()),
    onCreateEntryClick: () => {
      dispatch(showModal(CREATE_ENTRY_MODAL));
    },
    onUpdateEntryClick: (id) => {
      dispatch(entriesRdx.actions.updatingStart(id));
      dispatch(showModal(UPDATE_ENTRY_MODAL));
    }
  })
)(Entries));
