import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Dropdown } from 'semantic-ui-react';
import manualRunsRdx from '../../../redux/modules/etl/manualRuns';

const getDomainOptions = (domains) => domains.map((domain) => ({
  key: domain,
  text: domain,
  value: domain
}));

class Filters extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    domainOptions: PropTypes.array.isRequired,
    onSelectDomain: PropTypes.func.isRequired
  };

  state = {
    domainsSelected: [],
    domainOptions: []
  }

  static getDerivedStateFromProps(props, state) {
    const newDomainOptions = getDomainOptions(props.domainOptions);
    const existingDomainOptions = state.domainOptions;
    const newState = {};

    if (newDomainOptions.length !== existingDomainOptions.length) {
      const map = {};
      newDomainOptions.forEach((domainOption) => {
        map[domainOption.key] = domainOption.key;
      });

      existingDomainOptions.forEach((domainOption) => {
        if (!map[domainOption.key]) {
          newDomainOptions.push({ ...domainOption });
        }
      });

      newState.domainOptions = newDomainOptions;
    }

    if (props.filters.domain !== state.domainsSelected) {
      newState.domainsSelected = props.filters.domain;
    }

    return newState;
  }

  handleDomainAddition = (e, { value }) => {
    this.setState((prevState) => ({
      domainOptions: [{ key: value, text: value, value }, ...prevState.domainOptions],
    }));
  }

  render() {
    const { domainOptions, domainsSelected } = this.state;
    const { onSelectDomain } = this.props;

    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={6}>
            <Dropdown
              options={domainOptions}
              placeholder="Choose Domain"
              search
              selection
              fluid
              multiple
              allowAdditions
              value={domainsSelected}
              onAddItem={this.handleDomainAddition}
              onChange={onSelectDomain}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default connect(
  (state) => ({
    filters: manualRunsRdx.selectors.getFilters(state),
    domainOptions: manualRunsRdx.selectors.getDomains(state)
  }),
  (dispatch) => ({
    onSelectDomain: (e, { value }) => dispatch(manualRunsRdx.actions.setFilter('domain', value))
  })
)(Filters);
