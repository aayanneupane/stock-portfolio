import { StockHistory } from '../types/stock';

function generateMockHistory(basePrice: number, days: number): StockHistory['history'] {
  const history: StockHistory['history'] = [];
  let currentPrice = basePrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const changePercent = (Math.random() - 0.5) * 0.04;
    currentPrice = currentPrice * (1 + changePercent);
    
    const volume = Math.floor(Math.random() * 10000000) + 1000000;

    history.push({
      timestamp: date.getTime(),
      price: Number(currentPrice.toFixed(2)),
      volume,
    });
  }

  return history;
}

export const mockStocks: StockHistory[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    history: generateMockHistory(170, 90),
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    history: generateMockHistory(400, 90),
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    history: generateMockHistory(145, 90),
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    history: generateMockHistory(200, 90),
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    history: generateMockHistory(180, 90),
  }
];
