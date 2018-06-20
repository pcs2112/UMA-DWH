import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Grid, Dropdown } from 'semantic-ui-react';

class Filters extends Component {
  static propTypes = {
    servers: PropTypes.array.isRequired,
    serverName: PropTypes.string.isRequired,
    dbName: PropTypes.string.isRequired,
    procedureName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      serverName: props.serverName.toUpperCase(),
      dbName: props.dbName.toUpperCase(),
      procedureName: props.procedureName
    };

    this.handleOnChange = debounce(this.handleOnChange, 200);
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
        key: procedure.etl_stored_procedure,
        value: procedure.etl_stored_procedure,
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
      const procedureName = server.dbs[0].procedures[0].etl_stored_procedure;
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
      const procedureName = db.procedures[0].etl_stored_procedure;
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

  handleOnChange = () => {
    const { serverName, dbName, procedureName } = this.state;
    const { onChange } = this.props;
    onChange(serverName, dbName, procedureName);
  };

  render() {
    const { serverName, dbName, procedureName } = this.state;
    return (
      <Grid>
        <Grid.Column width={3}>
          <label>Server Name</label>
          <Dropdown
            fluid
            selectOnNavigation={false}
            selection
            name="false"
            options={this.getServerOptions()}
            onChange={this.handleServerNameOnChange}
            value={serverName}
          />
        </Grid.Column>
        <Grid.Column width={3}>
          <label>DB Name</label>
          <Dropdown
            fluid
            selectOnNavigation={false}
            selection
            name="false"
            options={this.getDbOptions()}
            onChange={this.handleDbNameOnChange}
            value={dbName}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <label>Procedure Name</label>
          <Dropdown
            fluid
            selectOnNavigation={false}
            selection
            name="false"
            options={this.getProcedureOptions()}
            onChange={this.handleProcedureNameOnChange}
            value={procedureName}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default Filters;
