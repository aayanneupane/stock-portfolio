export interface PriceDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface StockHistory {
  ticker: string;
  name: string;
  history: PriceDataPoint[];
}

export interface PortfolioEntry {
  id: string;
  ticker: string;
  companyName: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}
