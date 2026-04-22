import type { PortfolioEntry } from '../types/stock';

const STORAGE_KEY = 'portfolio_entries';
const STORAGE_VERSION = 1;

type StoredPayloadV1 = {
  version: 1;
  entries: PortfolioEntry[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isPortfolioEntry = (value: unknown): value is PortfolioEntry => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.ticker === 'string' &&
    typeof value.companyName === 'string' &&
    typeof value.quantity === 'number' &&
    Number.isFinite(value.quantity) &&
    typeof value.purchasePrice === 'number' &&
    Number.isFinite(value.purchasePrice) &&
    typeof value.purchaseDate === 'string'
  );
};

const normalizeEntries = (value: unknown): PortfolioEntry[] | null => {
  if (!Array.isArray(value)) return null;
  const filtered = value.filter(isPortfolioEntry);
  return filtered.length ? filtered : [];
};

export function loadPortfolioEntries(fallback: PortfolioEntry[]): PortfolioEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    // Back-compat: older versions stored an array directly
    if (Array.isArray(parsed)) {
      const normalized = normalizeEntries(parsed);
      return normalized ?? fallback;
    }

    if (isRecord(parsed) && parsed.version === 1) {
      const entries = normalizeEntries(parsed.entries);
      return entries ?? fallback;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export function savePortfolioEntries(entries: PortfolioEntry[]): boolean {
  try {
    const payload: StoredPayloadV1 = { version: STORAGE_VERSION, entries };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

