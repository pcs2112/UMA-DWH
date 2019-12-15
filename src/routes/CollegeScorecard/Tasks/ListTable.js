import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import withResponsiveTable from '../../../components/WithResponsiveTable';
import ReactTableRowExpander from '../../../components/ReactTableRowExpander';
import RowDetails from './RowDetails';

const keyName = 'id';
const defaultExpanded = {};

/**
 * Table columns
 */
const columns = [
  {
    expander: true,
    Expander: ReactTableRowExpander,
    width: 30,
  },
  {
    Header: 'JOB',
    accessor: 'python_job',
    width: 200,
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    width: 150,
  },
  {
    Header: 'STEP',
    accessor: 'step',
    width: 50,
    getProps: () => ({
      style: {
        textAlign: 'right',
      }
    }),
  },
  {
    Header: 'FILENAME',
    accessor: 'ftp_site',
    width: 150,
  },
  {
    Header: 'PATH',
    accessor: 'ftp_download_file_path',
    width: 150,
  },
  {
    Header: 'REQUEST_DTTM',
    accessor: 'request_dttm',
    width: 120,
  },
  {
    Header: 'POP_DTTM',
    accessor: 'pop_dttm',
    width: 120,
  },
  {
    Header: 'START_DTTM',
    accessor: 'start_dttm',
    width: 120,
  },
];

class ListTable extends Component {
  static propTypes = {
    tableHeight: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: defaultExpanded,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.tableHeight !== this.props.tableHeight
      || nextProps.isFetching !== this.props.isFetching
      || nextProps.dataLoaded !== this.props.dataLoaded
      || nextProps.data !== this.props.data
      || nextProps.fetchingError !== this.props.fetchingError
      || nextState.expanded !== this.state.expanded;
  }

  onExpanded = (newExpanded, index) => {
    const { expanded } = this.state;
    this.setState({
      expanded: {
        [index[0]]: !expanded[index[0]],
      }
    });
  };

  getLoadingText = () => {
    const { dataLoaded, fetchingError } = this.props;
    if (fetchingError) {
      return 'There was an error loading the history. Please refresh';
    }

    return dataLoaded ? '' : 'Loading...';
  };

  render() {
    const {
      tableHeight, isFetching, dataLoaded, data, fetchingError
    } = this.props;
    return (
      <div id="list-tbl">
        <ReactTable
          data={data}
          columns={columns}
          style={{
            height: `${tableHeight}px`
          }}
          showPaginationBottom={false}
          sortable={false}
          manual
          minRows={100}
          className="-striped"
          loading={isFetching || fetchingError}
          loadingText={this.getLoadingText()}
          noDataText={dataLoaded ? '0 records found.' : ''}
          keyField={keyName}
          SubComponent={row => <RowDetails row={row} />}
          expanded={this.state.expanded}
          onExpandedChange={this.onExpanded}
        />
      </div>
    );
  }
}

export default withResponsiveTable(ListTable, 510, 200);
