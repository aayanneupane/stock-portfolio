import { mockStocks } from '../data/mockStocks';

export function getCurrentPrice(ticker: string): number | null {
  const stock = mockStocks.find((s) => s.ticker === ticker);
  if (!stock || stock.history.length === 0) return null;
  return stock.history[stock.history.length - 1].price;
}
