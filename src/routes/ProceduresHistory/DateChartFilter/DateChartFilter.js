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
    const { data, procedureName } = this.props;
    const labels = data.map(item => moment(item.date, DEFAULT_DATE_FORMAT).toDate());
    const chartData = data.map(item => item.avg_runtime_sec);

    return {
      labels,
      datasets: [
        {
          label: `${procedureName} average runtime`,
          data: chartData,
          fill: false,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1.5,
          pointBorderWidth: 1.5,
          pointRadius: 1.5,
          pointHoverRadius: 1.5
        }
      ]
    };
  };

  renderTooltip = () => '';

  renderTooltipFooter = (tooltipItem) => {
    const { data } = this.props;
    const item = data[tooltipItem[0].index];
    return [
      `Avg. runtime: ${item.avg_runtime_sec}s`,
      `Day count: ${item.day_count}`,
      `Total Runtime: ${item.total_runtime}s`,
      `Total ins/upts: ${item.total_inserts + item.total_updates}`,
      `Avg. row / sec: ${item.avg_row_p_sec}`
    ];
  };

  render() {
    const { isFetching, dataLoaded } = this.props;
    if (isFetching && !dataLoaded) {
      return (
        <div style={{ height: '200px', position: 'relative' }}>
          <Dimmer active inverted>
            <Loader size="large" />
          </Dimmer>
        </div>
      );
    }

    return (
      <LineChart
        data={this.getChartData()}
        height={200}
        getElementAtEvent={this.onClick}
        options={{
          maintainAspectRatio: false,
          title: {
            display: false,
            text: ''
          },
          tooltips: {
            callbacks: {
              label: this.renderTooltip,
              afterBody: this.renderTooltipFooter
            },
          },
          onHover: (event, chartElement) => {
            event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                parser: 'MM/DD/YYYY HH:mm',
                tooltipFormat: 'll',
                unit: 'day'
              }
            }],
            yAxes: [{
              display: true,
              type: 'linear'
            }]
          }
        }}
      />
    );
  }
}

export default DateChartFilter;
