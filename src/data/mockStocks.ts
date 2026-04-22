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
    ticker: 'ACLBSL',
    name: 'NEPSE ACLBSL',
    history: generateMockHistory(979, 90),
  },
  {
    ticker: 'ADBL',
    name: 'Agricultural Development Bank',
    history: generateMockHistory(312.2, 90),
  },
  {
    ticker: 'AHL',
    name: 'NEPSE AHL',
    history: generateMockHistory(555.8, 90),
  },
  {
    ticker: 'AHPC',
    name: 'NEPSE AHPC',
    history: generateMockHistory(280, 90),
  },
  {
    ticker: 'AKJCL',
    name: 'NEPSE AKJCL',
    history: generateMockHistory(375, 90),
  },
  {
    ticker: 'AKPL',
    name: 'Arun Kabeli Power',
    history: generateMockHistory(258.5, 90),
  },
  {
    ticker: 'ALBSL',
    name: 'NEPSE ALBSL',
    history: generateMockHistory(1202.1, 90),
  },
  {
    ticker: 'ALICL',
    name: 'Asian Life Insurance',
    history: generateMockHistory(454, 90),
  },
  {
    ticker: 'ANLB',
    name: 'NEPSE ANLB',
    history: generateMockHistory(6056, 90),
  },
  {
    ticker: 'API',
    name: 'API Power Company',
    history: generateMockHistory(340, 90),
  },
  {
    ticker: 'AVYAN',
    name: 'NEPSE AVYAN',
    history: generateMockHistory(1106, 90),
  },
];
