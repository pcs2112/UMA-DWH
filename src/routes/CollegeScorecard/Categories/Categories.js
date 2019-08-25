import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import categoriesRdx from '../../../redux/modules/collegeScorecardCategories';
import filesRdx from '../../../redux/modules/collegeScorecardFiles';
import withMainLayout from '../../../components/WithMainLayout';
import ListTable from './ListTable';
import globalCss from '../../../css/global';

class Categories extends Component {
  static propTypes = {
    isCategoriesFetching: PropTypes.bool.isRequired,
    categoriesDataLoaded: PropTypes.bool.isRequired,
    categoriesData: PropTypes.array.isRequired,
    categoriesFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
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
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isCategoriesFetching: state.collegeScorecardCategories.isFetching,
    categoriesDataLoaded: state.collegeScorecardCategories.dataLoaded,
    categoriesData: categoriesRdx.selectors.getCollegeScorecardCategories(state),
    categoriesFetchingError: categoriesRdx.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchData: () =>
      Promise.all([
        dispatch(categoriesRdx.actions.fetch()),
        dispatch(filesRdx.actions.fetch())
      ]),
    resetData: () => {
      dispatch(categoriesRdx.actions.reset());
      dispatch(filesRdx.actions.reset());
    },
    onCreateCategoryClick: () => {
    },
    onUpdateCategoryClick: () => {
    }
  })
)(Categories));
