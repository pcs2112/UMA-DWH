import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { menuCss, chuckImgCss } from './css';
import logo from './logo.png';
import cmatula from './cmatula.png';

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
        <Menu.Item as={Link} to="/management" active={isActive(pathname, '/management')}>
          ETL Management
        </Menu.Item>
        <Menu.Item as={Link} to="/reports/history" active={isActive(pathname, '/reports/history')}>
          DWH Report History
        </Menu.Item>
        <Menu.Item as={Link} to="/statistics/history" active={isActive(pathname, '/statistics')}>
          DWH Statistics History
        </Menu.Item>
        <Menu.Item as={Link} to="/dwh/errors" active={isActive(pathname, '/dwh/errors')}>
          DWH Errors
        </Menu.Item>
        <Menu.Item as={Link} to="/errors/management" active={isActive(pathname, '/errors/management')}>
          Error Type Management
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/college_scorecard/reporting"
          active={
            isActive(pathname, '/college_scorecard/reporting')
            || isActive(pathname, '/college_scorecard/groups')
            || isActive(pathname, '/college_scorecard/categories')
          }
        >
          College Scorecard
        </Menu.Item>
        <Menu.Item as={Link} to="/telecom/reps" active={isActive(pathname, '/telecom')}>
          UMA Telecom
        </Menu.Item>
        <Menu.Item as={Link} to="/datalake" active={isActive(pathname, '/datalake')}>
          UMA Data Lake
        </Menu.Item>
        <Menu.Item as={Link} to="/datacubes" active={isActive(pathname, '/datacubes')}>
          UMA Data Cubes
        </Menu.Item>
        <Menu.Item as={Link} to="/users" active={isActive(pathname, '/users')}>
          Users
        </Menu.Item>
        <Menu.Item as={Link} to="/logout" onClick={this.onLogout}>
          Logout
        </Menu.Item>
        <div>
          <img src={cmatula} className="ui image" alt="Chuck Matula" style={chuckImgCss} />
        </div>
      </Menu>
    );
  }
}

export default withRouter(MainMenu);
