import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StockFormModal } from './StockFormModal';
import type { PortfolioEntry } from '../../types/stock';

describe('StockFormModal', () => {
  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(
      <StockFormModal open onClose={() => {}} onSubmit={() => {}} editEntry={null} />
    );

    await user.click(screen.getByRole('button', { name: /add stock/i }));

    expect(await screen.findByText(/ticker is required/i)).toBeInTheDocument();
    expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity must be a positive whole number/i)).toBeInTheDocument();
    expect(screen.getByText(/purchase price must be greater than 0/i)).toBeInTheDocument();
    expect(screen.getByText(/purchase date is required/i)).toBeInTheDocument();
  });

  it('submits a valid entry', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(entry: PortfolioEntry) => void>();

    render(<StockFormModal open onClose={() => {}} onSubmit={onSubmit} editEntry={null} />);

    // Select first ticker option (MUI Select)
    await user.click(screen.getByLabelText(/ticker/i));
    const options = await screen.findAllByRole('option');
    await user.click(options[0]);

    await user.type(screen.getByLabelText(/quantity/i), '10');
    await user.type(screen.getByLabelText(/purchase price/i), '123.45');
    await user.type(screen.getByLabelText(/date of purchase/i), '2026-04-22');

    await user.click(screen.getByRole('button', { name: /add stock/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.ticker).toMatch(/^[A-Z0-9.]+$/);
    expect(submitted.companyName.length).toBeGreaterThan(0);
    expect(submitted.quantity).toBe(10);
    expect(submitted.purchasePrice).toBeCloseTo(123.45);
    expect(submitted.purchaseDate).toBe('2026-04-22');
    expect(submitted.id).toBeTruthy();
  });

  it('prefills fields in edit mode and saves changes', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(entry: PortfolioEntry) => void>();

    const editEntry: PortfolioEntry = {
      id: 'p1',
      ticker: 'AAPL',
      companyName: 'Apple',
      quantity: 5,
      purchasePrice: 99,
      purchaseDate: '2026-01-01',
    };

    render(<StockFormModal open onClose={() => {}} onSubmit={onSubmit} editEntry={editEntry} />);

    expect(screen.getByDisplayValue('AAPL')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Apple')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-01-01')).toBeInTheDocument();

    const quantity = screen.getByLabelText(/quantity/i);
    await user.clear(quantity);
    await user.type(quantity, '7');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ id: 'p1', quantity: 7 });
  });
});

