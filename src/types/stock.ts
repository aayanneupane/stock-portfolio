export interface PriceDataPoint {
  timestamp: number; // Unix timestamp for easier charting
  price: number;
  volume: number;
}

export interface StockHistory {
  ticker: string;
  name: string;
  history: PriceDataPoint[];
}
