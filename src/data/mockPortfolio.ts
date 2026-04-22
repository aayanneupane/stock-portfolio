import type { PortfolioEntry } from '../types/stock';

export const mockPortfolio: PortfolioEntry[] = [
  {
    id: 'p1',
    ticker: 'ADBL',
    companyName: 'Agricultural Development Bank',
    quantity: 40,
    purchasePrice: 312,
  },
  {
    id: 'p2',
    ticker: 'API',
    companyName: 'API Power Company',
    quantity: 120,
    purchasePrice: 338,
  },
  {
    id: 'p3',
    ticker: 'AKPL',
    companyName: 'Arun Kabeli Power',
    quantity: 70,
    purchasePrice: 269,
  },
  {
    id: 'p4',
    ticker: 'ALICL',
    companyName: 'Asian Life Insurance',
    quantity: 25,
    purchasePrice: 452.2,
  },
  {
    id: 'p5',
    ticker: 'AHPC',
    companyName: 'NEPSE AHPC',
    quantity: 160,
    purchasePrice: 278.1,
  },
  {
    id: 'p6',
    ticker: 'ANLB',
    companyName: 'NEPSE ANLB',
    quantity: 3,
    purchasePrice: 6136,
  },
];
