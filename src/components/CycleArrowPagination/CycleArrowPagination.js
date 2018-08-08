import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Label } from 'semantic-ui-react';
import withCyclePagination from 'components/WithCyclePagination';
import { NavDiv, NavLeftColDiv, NavCenterColDiv, NavRightColDiv } from './css';

class CycleArrowPagination extends Component {
  static propTypes = {
    arrowColor: PropTypes.string,
    arrowSize: PropTypes.string,
    prevDisabled: PropTypes.bool.isRequired,
    nextDisabled: PropTypes.bool.isRequired,
    fetchPrev: PropTypes.func.isRequired,
    fetchNext: PropTypes.func.isRequired,
    cycleGroup: PropTypes.number.isRequired,
    cycleGroupStartDttm: PropTypes.string.isRequired,
    cycleGroupStartDttmLabel: PropTypes.string
  };

  static defaultProps = {
    arrowColor: 'green',
    arrowSize: 'huge',
    cycleGroupStartDttmLabel: 'Cycle Start DTTM'
  };

  constructor(props) {
    super(props);
    this.fetchPrev = this.fetchPrev.bind(this);
    this.fetchNext = this.fetchNext.bind(this);
  }

  fetchPrev(e) {
    e.preventDefault();
    if (!this.props.prevDisabled) {
      this.props.fetchPrev();
    }
  }

  fetchNext(e) {
    e.preventDefault();
    if (!this.props.nextDisabled) {
      this.props.fetchNext();
    }
  }

  render() {
    const {
      arrowSize, arrowColor, prevDisabled, nextDisabled, cycleGroup, cycleGroupStartDttm, cycleGroupStartDttmLabel
    } = this.props;
    return (
      <NavDiv>
        <NavLeftColDiv>
          <a href="#prev" onClick={this.fetchPrev}>
            <Icon name="arrow left" size={arrowSize} color={arrowColor} disabled={prevDisabled} />
          </a>
        </NavLeftColDiv>
        <NavCenterColDiv>
          <div>
            <Label color="blue">{cycleGroup * -1}</Label>
          </div>
          <div>{cycleGroupStartDttmLabel}</div>
          <div>
            ({cycleGroupStartDttm})
          </div>
        </NavCenterColDiv>
        <NavRightColDiv>
          <a href="#next" onClick={this.fetchNext}>
            <Icon name="arrow right" size={arrowSize} color={arrowColor} disabled={nextDisabled} />
          </a>
        </NavRightColDiv>
      </NavDiv>
    );
  }
}

export default withCyclePagination(CycleArrowPagination);
