import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { PriceDataPoint } from '../../types/stock';

interface StockColumnChartProps {
  ticker: string;
  data: PriceDataPoint[];
}

export function StockColumnChart({ ticker, data }: StockColumnChartProps) {
  const chartData = data.map((point) => [point.timestamp, point.volume]);

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: `${ticker} Daily Volume`,
      style: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
      }
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Volume Traded'
      },
      labels: {
        formatter: function () {
          return (this.value as number) >= 1e6 
            ? ((this.value as number) / 1e6).toFixed(1) + 'M'
            : this.value.toString();
        }
      }
    },
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      pointFormatter: function () {
        return `Volume: <b>${this.y?.toLocaleString()}</b>`;
      }
    },
    series: [
      {
        type: 'column',
        name: 'Volume',
        data: chartData,
        color: '#9c27b0',
        borderRadius: 2
      }
    ],
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ style: { height: '100%', width: '100%' } }} />
    </div>
  );
}
