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
        <Menu.Item as={Link} to="/report/history" active={isActive(pathname, '/report')}>
          Report History
        </Menu.Item>
        <Menu.Item as={Link} to="/errors/management" active={isActive(pathname, '/errors')}>
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
