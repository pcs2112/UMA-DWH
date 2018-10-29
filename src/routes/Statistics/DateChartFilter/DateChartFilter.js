import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line as LineChart } from 'react-chartjs-2';
import { Dimmer, Loader } from 'semantic-ui-react';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
import globalCss from 'css/global';

class DateChartFilter extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    schema: PropTypes.string.isRequired,
    months: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data;
  }

  onClick = (elems) => {
    const {
      isFetching, data, schema, months, onClick
    } = this.props;
    if (!isFetching && elems.length > 0) {
      setTimeout(() => {
        onClick(schema, data[elems[0]._index].date, months);
      }, 250);
    }
  };

  getChartData = () => {
    const { data } = this.props;
    const labels = data.map(item => moment(item.date, DEFAULT_DATE_FORMAT).toDate());
    const runTimesData = data.map(item => item.total_runtime);

    return {
      labels,
      datasets: [
        {
          label: 'Run time (secs)',
          data: runTimesData,
          fill: false,
          backgroundColor: globalCss.colors.darkTurquoise,
          borderColor: globalCss.colors.darkTurquoise,
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
      `Avg. runtime: ${item.avg_runtime}s`,
      `Start time: ${item.group_start_time}`,
      `End time: ${item.group_end_time}`,
      `Status: ${item.group_status}`,
      `Total Runtime: ${item.total_runtime}s`
    ];
  };

  render() {
    const { isFetching, dataLoaded, schema } = this.props;
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
            display: true,
            text: schema
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
            yAxes: [
              {
                display: true,
                type: 'linear',
                position: 'left'
              }
            ]
          }
        }}
      />
    );
  }
}

export default DateChartFilter;
