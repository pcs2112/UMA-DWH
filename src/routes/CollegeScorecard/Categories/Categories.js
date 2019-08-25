import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import categoriesRdx from '../../../redux/modules/collegeScorecardCategories';
import withMainLayout from '../../../components/WithMainLayout';
import ListTable from './ListTable';
import globalCss from '../../../css/global';

class Categories extends Component {
  static propTypes = {
    isCategoriesFetching: PropTypes.bool.isRequired,
    categoriesDataLoaded: PropTypes.bool.isRequired,
    categoriesData: PropTypes.array.isRequired,
    categoriesFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchCategories: PropTypes.func.isRequired,
    resetCategories: PropTypes.func.isRequired,
    onCreateCategoryClick: PropTypes.func.isRequired,
    onUpdateCategoryClick: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchCategories } = this.props;
    fetchCategories();
  }

  componentWillUnmount() {
    const { resetCategories } = this.props;
    resetCategories();
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
    fetchCategories: () => dispatch(categoriesRdx.actions.fetch()),
    resetCategories: () => dispatch(categoriesRdx.actions.reset()),
    onCreateCategoryClick: () => {
    },
    onUpdateCategoryClick: () => {
    }
  })
)(Categories));
