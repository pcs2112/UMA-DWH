import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { menuCss } from './css';
import logo from './logo.png';

const isActive = (currentPathName, pathName) => currentPathName === pathName;

class MainMenu extends Component {
  static propTypes = {
    currentPathName: PropTypes.string.isRequired,
    onLogout: PropTypes.func.isRequired
  };

  onLogout = (e) => {
    e.preventDefault();
    this.props.onLogout();
  };

  render() {
    const { currentPathName } = this.props;
    return (
      <Menu inverted fixed="left" vertical size="large" style={menuCss}>
        <div className="item">
          <Link to="/">
            <img src={logo} className="ui image" alt="UMA DWH" />
          </Link>
        </div>
        <Menu.Item as={Link} to="/" active={isActive(currentPathName, '/')}>
          ETL Cycle History
        </Menu.Item>
        <Menu.Item as={Link} to="/procedures/history" active={isActive(currentPathName, '/procedures/history')}>
          ETL Procedure History
        </Menu.Item>
        <Menu.Item as={Link} to="/users" active={isActive(currentPathName, '/users')}>
          Users
        </Menu.Item>
        <Menu.Item as={Link} to="/logout" onClick={this.onLogout}>
          Logout
        </Menu.Item>
      </Menu>
    );
  }
}

export default MainMenu;
