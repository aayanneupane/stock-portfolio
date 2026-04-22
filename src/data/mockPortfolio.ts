import type { PortfolioEntry } from '../types/stock';

export const mockPortfolio: PortfolioEntry[] = [
  {
    id: 'p1',
    ticker: 'ADBL',
    companyName: 'Agricultural Development Bank',
    quantity: 40,
    purchasePrice: 312,
    purchaseDate: '2025-01-15',
  },
  {
    id: 'p2',
    ticker: 'API',
    companyName: 'API Power Company',
    quantity: 120,
    purchasePrice: 338,
    purchaseDate: '2025-02-05',
  },
  {
    id: 'p3',
    ticker: 'AKPL',
    companyName: 'Arun Kabeli Power',
    quantity: 70,
    purchasePrice: 269,
    purchaseDate: '2025-02-20',
  },
  {
    id: 'p4',
    ticker: 'ALICL',
    companyName: 'Asian Life Insurance',
    quantity: 25,
    purchasePrice: 452.2,
    purchaseDate: '2025-03-02',
  },
  {
    id: 'p5',
    ticker: 'AHPC',
    companyName: 'NEPSE AHPC',
    quantity: 160,
    purchasePrice: 278.1,
    purchaseDate: '2025-03-18',
  },
  {
    id: 'p6',
    ticker: 'ANLB',
    companyName: 'NEPSE ANLB',
    quantity: 3,
    purchasePrice: 6136,
    purchaseDate: '2025-04-01',
  },
];
