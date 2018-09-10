import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line as LineChart } from 'react-chartjs-2';
import { Dimmer, Loader } from 'semantic-ui-react';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'constants/index';

class DateChartFilter extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    serverName: PropTypes.string.isRequired,
    dbName: PropTypes.string.isRequired,
    procedureName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data;
  }

  onClick = (elems) => {
    const {
      isFetching, data, serverName, dbName, procedureName, onClick
    } = this.props;
    if (!isFetching && elems.length > 0) {
      onClick(serverName, dbName, procedureName, data[elems[0]._index].date);
    }
  };

  getChartData = () => {
    const { data } = this.props;
    const labels = data.map(item => moment(item.date, DEFAULT_DATE_FORMAT).toDate());
    const chartData = data.map(item => item.avg_runtime_sec);

    return {
      labels,
      datasets: [
        {
          label: 'Avg. Runtime in seconds',
          data: chartData,
          fill: false,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
          pointBorderWidth: 1,
          pointRadius: 1,
          pointHoverRadius: 1
        }
      ]
    };
  };

  render() {
    const { isFetching, dataLoaded } = this.props;
    if (isFetching && !dataLoaded) {
      return (
        <div style={{ height: '150px', position: 'relative' }}>
          <Dimmer active inverted>
            <Loader size="large" />
          </Dimmer>
        </div>
      );
    }

    return (
      <LineChart
        data={this.getChartData()}
        height={150}
        getElementAtEvent={this.onClick}
        options={{
          maintainAspectRatio: false,
          title: {
            display: false,
            text: ''
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                format: 'MM/DD/YYYY HH:mm',
                tooltipFormat: 'll',
                unit: 'day'
              }
            }],
            yAxes: [{
              display: true,
              type: 'linear',
              ticks: {
                max: 10,
                min: 0,
                stepSize: 5
              }
            }]
          }
        }}
      />
    );
  }
}

export default DateChartFilter;
