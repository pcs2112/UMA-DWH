import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import { showModal } from 'redux-modal';
import skillsRdx from '../../../redux/modules/telecom/skills';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import ListTable from './ListTable';
import SwitchPageDropdown from '../SwitchPageDropdown';
import UpdateSkillModal from './UpdateSkillModal';

const UPDATE_SKILL_MODAL = 'UPDATE_SKILL_MODAL';
const updatingTypes = skillsRdx.selectors.getUpdatingTypesDropdownOptions();

class Skills extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchData: PropTypes.func.isRequired,
    resetData: PropTypes.func.isRequired,
    onUpdateSkillClick: PropTypes.func.isRequired
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
      onUpdateSkillClick
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            UMA Telecom (Skills)
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isFetching}
            dataLoaded={dataLoaded}
            data={data}
            fetchingError={fetchingError}
            onEdit={onUpdateSkillClick}
          />
        </Segment>
        <Segment>
          <SwitchPageDropdown />
        </Segment>
        <UpdateSkillModal
          name={UPDATE_SKILL_MODAL}
          updateTypes={updatingTypes}
        />
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isFetching: state.telecomSkills.isFetching,
    dataLoaded: state.telecomSkills.dataLoaded,
    data: skillsRdx.selectors.getData(state),
    fetchingError: skillsRdx.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchData: () => dispatch(skillsRdx.actions.fetch()),
    resetData: () => dispatch(skillsRdx.actions.reset()),
    onUpdateSkillClick: (id) => {
      dispatch(skillsRdx.actions.updatingStart(id));
      dispatch(showModal(UPDATE_SKILL_MODAL));
    }
  })
)(Skills));
