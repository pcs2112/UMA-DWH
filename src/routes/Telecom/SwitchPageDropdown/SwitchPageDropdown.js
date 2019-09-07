import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const path = '/telecom';

const options = [
  {
    key: 'reps',
    value: '/reps',
    text: 'Reps'
  },
  {
    key: 'roles',
    value: '/roles',
    text: 'Roles'
  },
  {
    key: 'skills',
    value: '/skills',
    text: 'Skills'
  },
  {
    key: 'workgroups',
    value: '/workgroups',
    text: 'Workgroups'
  }
];

class SwitchPageDropdown extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    })
  };

  onChange = (e, { value }) => {
    this.context.router.history.push(`${path}${value}`);
  };

  render() {
    let { location: { pathname = '/reps' } } = this.context.router.history;
    pathname = pathname.replace(path, '');

    return (
      <Dropdown
        selectOnNavigation={false}
        selection
        name="false"
        options={options}
        onChange={this.onChange}
        value={pathname}
      />
    );
  }
}

export default SwitchPageDropdown;
