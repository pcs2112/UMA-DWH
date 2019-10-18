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
    months: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    hide911: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data || nextProps.hide911 !== this.props.hide911;
  }

  getItemKey = () => {
    const { hide911 } = this.props;
    return hide911 ? 'day_count_not_911' : 'day_count';
  };

  onClick = (elems) => {
    const {
      isFetching, data, months, onClick
    } = this.props;
    if (!isFetching && elems.length > 0) {
      setTimeout(() => {
        onClick(data[elems[0]._index].date, months);
      }, 250);
    }
  };

  getChartData = () => {
    const { data } = this.props;
    const labels = data.map(item => moment(item.date, DEFAULT_DATE_FORMAT).toDate());
    const itemKey = this.getItemKey();
    const runCountsData = data.map(item => item[itemKey]);

    return {
      labels,
      datasets: [
        {
          label: 'Day count',
          data: runCountsData,
          fill: false,
          backgroundColor: globalCss.colors.red,
          borderColor: globalCss.colors.red,
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
    const itemKey = this.getItemKey();
    return [
      `Day count: ${item[itemKey]}`
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
            display: true,
            text: 'DWH Errors'
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
