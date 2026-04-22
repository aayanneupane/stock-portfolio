import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PortfolioEntry } from '../../types/stock';

interface PortfolioState {
  entries: PortfolioEntry[];
  selectedTicker: string;
}

const initialState: PortfolioState = {
  entries: [],
  selectedTicker: '',
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    hydratePortfolio(state, action: PayloadAction<PortfolioEntry[]>) {
      state.entries = action.payload;
      state.selectedTicker = action.payload[0]?.ticker ?? '';
    },
    upsertEntry(state, action: PayloadAction<PortfolioEntry>) {
      const idx = state.entries.findIndex((item) => item.id === action.payload.id);
      if (idx === -1) {
        state.entries.unshift(action.payload);
      } else {
        state.entries[idx] = action.payload;
      }
      state.selectedTicker = action.payload.ticker;
    },
    removeEntry(state, action: PayloadAction<string>) {
      const removed = state.entries.find((item) => item.id === action.payload);
      state.entries = state.entries.filter((item) => item.id !== action.payload);
      if (!state.entries.length) {
        state.selectedTicker = '';
      } else if (removed?.ticker === state.selectedTicker) {
        state.selectedTicker = state.entries[0].ticker;
      }
    },
    setSelectedTicker(state, action: PayloadAction<string>) {
      state.selectedTicker = action.payload;
    },
  },
});

export const { hydratePortfolio, upsertEntry, removeEntry, setSelectedTicker } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;

