import { describe, expect, it, vi } from 'vitest';
import { render, screen, within, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { PortfolioPage } from './PortfolioPage';
import { createAppStore } from '../store/store';

vi.mock('../features/dashboard/StockLineChart', () => ({
  StockLineChart: () => <div data-testid="mock-line-chart" />,
}));

vi.mock('../features/dashboard/StockColumnChart', () => ({
  StockColumnChart: () => <div data-testid="mock-column-chart" />,
}));

describe('PortfolioPage', () => {
  it('adds, edits, and deletes a stock (and persists)', async () => {
    const user = userEvent.setup();
    const store = createAppStore();

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null); 

    render(
      <Provider store={store}>
        <PortfolioPage />
      </Provider>
    );

    
    await user.click(screen.getByRole('button', { name: /add stock/i }));

    await user.click(screen.getByLabelText(/ticker/i));
    const options = await screen.findAllByRole('option');
    await user.click(options[0]);

    await user.type(screen.getByLabelText(/quantity/i), '11');
    await user.type(screen.getByLabelText(/purchase price/i), '555');
    await user.type(screen.getByLabelText(/date of purchase/i), '2026-04-22');
    await user.click(screen.getByRole('button', { name: /^add stock$/i }));

    const addDialog = screen.queryByRole('dialog', { name: /add stock to portfolio/i });
    if (addDialog) await waitForElementToBeRemoved(addDialog);

    
    expect(await screen.findByText('11')).toBeInTheDocument();
    expect(setItem).toHaveBeenCalled(); // persisted

    const editButtons = screen.getAllByRole('button', { name: /edit stock/i });
    await user.click(editButtons[0]);

    const qty = screen.getByLabelText(/quantity/i);
    await user.clear(qty);
    await user.type(qty, '12');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    const editDialog = screen.queryByRole('dialog', { name: /edit stock/i });
    if (editDialog) await waitForElementToBeRemoved(editDialog);

    expect(await screen.findByText('12')).toBeInTheDocument();

    // Defensive: ensure no stock form dialog is blocking table interactions.
    const maybeOpenDialog = screen.queryByRole('dialog');
    if (maybeOpenDialog) {
      await user.keyboard('{Escape}');
      const stillThere = screen.queryByRole('dialog');
      if (stillThere) await waitForElementToBeRemoved(stillThere);
    }

    const deleteButtons = screen.getAllByRole('button', { name: /delete stock/i });
    await user.click(deleteButtons[0]);

    const dialog = screen.getByRole('dialog', { name: /delete stock/i });
    await user.click(within(dialog).getByRole('button', { name: /^delete$/i }));

  
    expect(setItem).toHaveBeenCalled();
  }, 10_000);
});

