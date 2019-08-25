import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import { showModal } from 'redux-modal';
import categoriesRdx from '../../../redux/modules/collegeScorecardCategories';
import filesRdx from '../../../redux/modules/collegeScorecardFiles';
import formulaTablesRdx from '../../../redux/modules/collegeScorecardFormulaTables';
import withMainLayout from '../../../components/WithMainLayout';
import ListTable from './ListTable';
import globalCss from '../../../css/global';
import CreateCategoryModal from './CreateCategoryModal';
import UpdateCategoryModal from './UpdateCategoryModal';

const CREATE_CATEGORY_MODAL = 'CREATE_CATEGORY_MODAL';
const UPDATE_CATEGORY_MODAL = 'UPDATE_CATEGORY_MODAL';

class Categories extends Component {
  static propTypes = {
    isCategoriesFetching: PropTypes.bool.isRequired,
    categoriesDataLoaded: PropTypes.bool.isRequired,
    categoriesData: PropTypes.array.isRequired,
    categoriesFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    files: PropTypes.array.isRequired,
    formulaTables: PropTypes.array.isRequired,
    fetchData: PropTypes.func.isRequired,
    resetData: PropTypes.func.isRequired,
    onCreateCategoryClick: PropTypes.func.isRequired,
    onUpdateCategoryClick: PropTypes.func.isRequired
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
      isCategoriesFetching,
      categoriesDataLoaded,
      categoriesData,
      categoriesFetchingError,
      files,
      formulaTables,
      onCreateCategoryClick,
      onUpdateCategoryClick
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            College Scorecard Category List
          </h1>
        </Segment>
        <Segment>
          <Button primary onClick={onCreateCategoryClick}>Create Category</Button>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isCategoriesFetching}
            dataLoaded={categoriesDataLoaded}
            data={categoriesData}
            fetchingError={categoriesFetchingError}
            onEdit={onUpdateCategoryClick}
          />
        </Segment>
        <CreateCategoryModal
          name={CREATE_CATEGORY_MODAL}
          files={files}
          tables={formulaTables}
        />
        <UpdateCategoryModal
          name={UPDATE_CATEGORY_MODAL}
          files={files}
          tables={formulaTables}
        />
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isCategoriesFetching: state.collegeScorecardCategories.isFetching,
    categoriesDataLoaded: state.collegeScorecardCategories.dataLoaded,
    categoriesData: categoriesRdx.selectors.getCollegeScorecardCategories(state),
    categoriesFetchingError: categoriesRdx.selectors.getFetchingError(state),
    files: filesRdx.selectors.getCollegeScorecardFilesDropdownOptions(state),
    formulaTables: formulaTablesRdx.selectors.getCollegeScorecardFormulaTablesDropdownOptions(state)
  }),
  dispatch => ({
    fetchData: () =>
      Promise.all([
        dispatch(categoriesRdx.actions.fetch()),
        dispatch(filesRdx.actions.fetch()),
        dispatch(formulaTablesRdx.actions.fetch())
      ]),
    resetData: () => {
      dispatch(categoriesRdx.actions.reset());
      dispatch(filesRdx.actions.reset());
      dispatch(formulaTablesRdx.actions.reset());
    },
    onCreateCategoryClick: () => {
      dispatch(showModal(CREATE_CATEGORY_MODAL));
    },
    onUpdateCategoryClick: (id) => {
      dispatch(categoriesRdx.actions.updatingStart(id));
      dispatch(showModal(UPDATE_CATEGORY_MODAL));
    }
  })
)(Categories));
