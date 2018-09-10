import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Dropdown, Form } from 'semantic-ui-react';
import { FILTERS_EXEC_DELAY } from 'constants/index';

class DropdownFilters extends Component {
  static propTypes = {
    servers: PropTypes.array.isRequired,
    serverName: PropTypes.string.isRequired,
    dbName: PropTypes.string.isRequired,
    procedureName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      serverName: props.serverName.toUpperCase(),
      dbName: props.dbName.toUpperCase(),
      procedureName: props.procedureName
    };

    this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
  }

  getServerOptions = () => this.props.servers.map(server => ({
    key: server.name.toUpperCase(),
    value: server.name.toUpperCase(),
    text: server.name
  }));

  getDbOptions = () => {
    const { servers } = this.props;
    const { serverName } = this.state;
    return servers.find(server => server.name.toUpperCase() === serverName.toUpperCase())
      .dbs.map(db => ({
        key: db.name.toUpperCase(),
        value: db.name.toUpperCase(),
        text: db.name
      }));
  };

  getProcedureOptions = () => {
    const { serverName, dbName } = this.state;
    const { servers } = this.props;
    return servers.find(server => server.name.toUpperCase() === serverName.toUpperCase())
      .dbs.find(db => db.name.toUpperCase() === dbName.toUpperCase())
      .procedures.map(procedure => ({
        key: procedure.etl_stored_procedure.toUpperCase(),
        value: procedure.etl_stored_procedure.toUpperCase(),
        text: procedure.etl_stored_procedure
      }));
  };

  handleServerNameOnChange = (e, { value }) => {
    const normalizedValue = value.toUpperCase();
    if (normalizedValue !== this.state.serverName) {
      const { servers } = this.props;
      const server = servers.find(item => item.name.toUpperCase() === normalizedValue);
      const serverName = normalizedValue;
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
    const normalizedValue = value.toUpperCase();
    if (normalizedValue !== this.state.dbName) {
      const { serverName } = this.state;
      const { servers } = this.props;
      const server = servers.find(item => item.name.toUpperCase() === serverName);
      const db = server.dbs.find(item => item.name.toUpperCase() === normalizedValue);
      const dbName = normalizedValue;
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
        procedureName: value.toUpperCase()
      }, this.handleOnChange);
    }
  };

  handleOnChange = () => {
    const {
      serverName, dbName, procedureName
    } = this.state;
    const { date, onChange } = this.props;
    onChange(serverName, dbName, procedureName, date);
  };

  render() {
    const { serverName, dbName, procedureName } = this.state;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={3}>
            <label>Server Name</label>
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
            <label>DB Name</label>
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
            <label>Proc. Name</label>
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
      </Form>
    );
  }
}

export default DropdownFilters;
