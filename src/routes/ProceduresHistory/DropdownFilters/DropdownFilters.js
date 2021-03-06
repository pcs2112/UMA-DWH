import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Dropdown, Form } from 'semantic-ui-react';
import { FILTERS_EXEC_DELAY } from 'constants/index';
import monthFilterOptions from 'constants/monthFilterOptions';

class DropdownFilters extends Component {
  static propTypes = {
    servers: PropTypes.array.isRequired,
    serverName: PropTypes.string.isRequired,
    dbName: PropTypes.string.isRequired,
    procedureName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    months: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      serverName: props.serverName.toUpperCase(),
      dbName: props.dbName.toUpperCase(),
      procedureName: props.procedureName.toUpperCase(),
      months: props.months
    };

    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  getServerOptions = () => this.props.servers.map((server) => {
    const serverName = server.name.toUpperCase();
    return {
      key: serverName,
      value: serverName,
      text: serverName
    };
  });

  getDbOptions = () => {
    const { servers } = this.props;
    const { serverName } = this.state;
    return servers.find(server => server.name.toUpperCase() === serverName)
      .dbs.map((db) => {
        const dbName = db.name.toUpperCase();
        return {
          key: dbName,
          value: dbName,
          text: dbName
        };
      });
  };

  getProcedureOptions = () => {
    const { serverName, dbName } = this.state;
    const { servers } = this.props;
    return servers.find(server => server.name.toUpperCase() === serverName)
      .dbs.find(db => db.name.toUpperCase() === dbName)
      .procedures.map((procedure) => {
        const procedureName = procedure.etl_stored_procedure.toUpperCase();
        return {
          key: procedureName,
          value: procedureName,
          text: procedureName
        };
      });
  };

  handleServerNameOnChange = (e, { value }) => {
    if (value !== this.state.serverName) {
      const { servers } = this.props;
      const server = servers.find(item => item.name.toUpperCase() === value);
      const serverName = value;
      const dbName = server.dbs[0].name.toUpperCase();
      const procedureName = server.dbs[0].procedures[0].etl_stored_procedure.toUpperCase();
      this.setState({
        serverName,
        dbName,
        procedureName,
      }, this.handleOnChange);
    }
  };

  handleDbNameOnChange = (e, { value }) => {
    if (value !== this.state.dbName) {
      const { serverName } = this.state;
      const { servers } = this.props;
      const server = servers.find(item => item.name.toUpperCase() === serverName);
      const db = server.dbs.find(item => item.name.toUpperCase() === value);
      const dbName = value;
      const procedureName = db.procedures[0].etl_stored_procedure.toUpperCase();
      this.setState({
        dbName,
        procedureName,
      }, this.handleOnChange);
    }
  };

  handleProcedureNameOnChange = (e, { value }) => {
    if (value !== this.state.procedureName) {
      this.setState({
        procedureName: value
      }, this.handleOnChange);
    }
  };

  handleMonthsOnChange = (e, { value }) => {
    if (value !== this.state.months) {
      this.setState({
        months: parseInt(value, 10)
      }, this.handleOnChange);
    }
  };

  handleOnChange = () => {
    const {
      serverName, dbName, procedureName, months
    } = this.state;
    const { date, onChange } = this.props;
    onChange(serverName, dbName, procedureName, date, months);
  };

  render() {
    const {
      serverName, dbName, procedureName, months
    } = this.state;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={3}>
            <div className="right-aligned-label">
              <label>Server</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              selectOnNavigation={false}
              selection
              name="false"
              options={this.getServerOptions()}
              onChange={this.handleServerNameOnChange}
              value={serverName}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group inline>
          <Form.Field width={3}>
            <div className="right-aligned-label">
              <label>Database</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              fluid
              selectOnNavigation={false}
              selection
              name="false"
              options={this.getDbOptions()}
              onChange={this.handleDbNameOnChange}
              value={dbName}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group inline>
          <Form.Field width={3}>
            <div className="right-aligned-label">
              <label>Procedure</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              fluid
              selectOnNavigation={false}
              selection
              name="false"
              options={this.getProcedureOptions()}
              onChange={this.handleProcedureNameOnChange}
              value={procedureName}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group inline>
          <Form.Field width={3}>
            <div className="right-aligned-label">
              <label>Chart Date Range</label>
            </div>
          </Form.Field>
          <Form.Field width={13}>
            <Dropdown
              fluid
              selectOnNavigation={false}
              selection
              name="false"
              options={monthFilterOptions}
              onChange={this.handleMonthsOnChange}
              value={months}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default DropdownFilters;
