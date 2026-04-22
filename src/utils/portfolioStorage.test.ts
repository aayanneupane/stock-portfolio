import { describe, expect, it, vi } from 'vitest';
import { loadPortfolioEntries, savePortfolioEntries } from './portfolioStorage';
import type { PortfolioEntry } from '../types/stock';

const fallback: PortfolioEntry[] = [
  {
    id: 'p1',
    ticker: 'AAPL',
    companyName: 'Apple',
    quantity: 1,
    purchasePrice: 100,
    purchaseDate: '2026-01-01',
  },
];

describe('portfolioStorage', () => {
  it('returns fallback when storage is empty', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);
    expect(loadPortfolioEntries(fallback)).toEqual(fallback);
  });

  it('returns fallback when stored JSON is invalid', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('{bad json');
    expect(loadPortfolioEntries(fallback)).toEqual(fallback);
  });

  it('returns fallback when stored value is not an array', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify({ hello: 'world' }));
    expect(loadPortfolioEntries(fallback)).toEqual(fallback);
  });

  it('loads entries when stored value is an array', () => {
    const stored = [
      {
        id: 'p2',
        ticker: 'MSFT',
        companyName: 'Microsoft',
        quantity: 2,
        purchasePrice: 200,
        purchaseDate: '2026-02-02',
      },
    ] satisfies PortfolioEntry[];

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify(stored));
    expect(loadPortfolioEntries(fallback)).toEqual(stored);
  });

  it('saves entries to localStorage', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    const entries = fallback;

    savePortfolioEntries(entries);

    expect(setItem).toHaveBeenCalledWith('portfolio_entries', JSON.stringify(entries));
  });
});

