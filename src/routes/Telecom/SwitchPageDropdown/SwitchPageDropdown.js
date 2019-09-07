import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const path = '/telecom';

const options = [
  {
    key: 'skills',
    value: '/skills',
    text: 'Skills'
  },
  {
    key: 'workgroups',
    value: '/workgroups',
    text: 'Workgroups'
  },
  {
    key: 'roles',
    value: '/roles',
    text: 'Roles'
  },
  {
    key: 'reps',
    value: '/reps',
    text: 'Reps'
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
    let { location: { pathname = '/skills' } } = this.context.router.history;
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
