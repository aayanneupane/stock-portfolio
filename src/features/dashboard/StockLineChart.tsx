import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { PriceDataPoint } from '../../types/stock';

interface StockLineChartProps {
  ticker: string;
  data: PriceDataPoint[];
}

export function StockLineChart({ ticker, data }: StockLineChartProps) {
  const chartData = data.map((point) => [point.timestamp, point.price]);

  const options: Highcharts.Options = {
    title: {
      text: `${ticker} Price Trend`,
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
        text: 'Price (USD)'
      },
      labels: {
        format: '${value}'
      }
    },
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      pointFormat: 'Price: <b>${point.y:.2f}</b>'
    },
    series: [
      {
        type: 'line',
        name: ticker,
        data: chartData,
        color: '#1976d2',
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    ],
    credits: {
      enabled: false
    },
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ style: { height: '100%', width: '100%' } }} />
    </div>
  );
}
