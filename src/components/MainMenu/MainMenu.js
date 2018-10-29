import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { menuCss } from './css';
import logo from './logo.png';

const isActive = (currentPathName, pathName) => currentPathName.indexOf(pathName) > -1;

class MainMenu extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired
  };

  onLogout = (e) => {
    e.preventDefault();
    this.props.onLogout();
  };

  render() {
    const { location: { pathname } } = this.props;
    return (
      <Menu inverted fixed="left" vertical size="large" style={menuCss}>
        <div className="item">
          <Link to="/">
            <img src={logo} className="ui image" alt="UMA DWH" />
          </Link>
        </div>
        <Menu.Item as={Link} to="/" active={pathname === '/'}>
          ETL Cycle History
        </Menu.Item>
        <Menu.Item as={Link} to="/procedures/history" active={isActive(pathname, '/procedures/history')}>
          ETL Procedure History
        </Menu.Item>
        <Menu.Item as={Link} to="/reports/history" active={isActive(pathname, '/reports/history')}>
          DWH Report History
        </Menu.Item>
        <Menu.Item as={Link} to="/dwh/statistics" active={isActive(pathname, '/dwh/statistics')}>
          DWH Statistics History
        </Menu.Item>
        <Menu.Item as={Link} to="/dwh/errors" active={isActive(pathname, '/dwh/errors')}>
          DWH Errors
        </Menu.Item>
        <Menu.Item as={Link} to="/errors/management" active={isActive(pathname, '/errors/management')}>
          Error Type Management
        </Menu.Item>
        <Menu.Item as={Link} to="/users" active={isActive(pathname, '/users')}>
          Users
        </Menu.Item>
        <Menu.Item as={Link} to="/logout" onClick={this.onLogout}>
          Logout
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(MainMenu);
