import type { PortfolioEntry } from '../types/stock';

const STORAGE_KEY = 'portfolio_entries';

export function loadPortfolioEntries(fallback: PortfolioEntry[]): PortfolioEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    return parsed as PortfolioEntry[];
  } catch {
    return fallback;
  }
}

export function savePortfolioEntries(entries: PortfolioEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

