import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { mockStocks } from '../../data/mockStocks';
import type { PortfolioEntry } from '../../types/stock';

interface StockFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entry: PortfolioEntry) => void;
  editEntry?: PortfolioEntry | null;
}

interface FormState {
  ticker: string;
  companyName: string;
  quantity: string;
  purchasePrice: string;
  purchaseDate: string;
}

interface FormErrors {
  ticker?: string;
  companyName?: string;
  quantity?: string;
  purchasePrice?: string;
  purchaseDate?: string;
}

const initialState: FormState = {
  ticker: '',
  companyName: '',
  quantity: '',
  purchasePrice: '',
  purchaseDate: '',
};

export function StockFormModal({ open, onClose, onSubmit, editEntry }: StockFormModalProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const stockOptions = useMemo(
    () => mockStocks.map((stock) => ({ ticker: stock.ticker, name: stock.name })),
    []
  );

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setErrors({});
      return;
    }
    if (editEntry) {
      setForm({
        ticker: editEntry.ticker,
        companyName: editEntry.companyName,
        quantity: String(editEntry.quantity),
        purchasePrice: String(editEntry.purchasePrice),
        purchaseDate: editEntry.purchaseDate,
      });
      setErrors({});
    }
  }, [open, editEntry]);

  const handleTickerChange = (ticker: string) => {
    const match = stockOptions.find((stock) => stock.ticker === ticker);
    setForm((prev) => ({
      ...prev,
      ticker,
      companyName: match?.name ?? '',
    }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.ticker.trim()) nextErrors.ticker = 'Ticker is required';
    if (!form.companyName.trim()) nextErrors.companyName = 'Company name is required';

    const quantity = Number(form.quantity);
    if (!form.quantity || Number.isNaN(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
      nextErrors.quantity = 'Quantity must be a positive whole number';
    }

    const purchasePrice = Number(form.purchasePrice);
    if (!form.purchasePrice || Number.isNaN(purchasePrice) || purchasePrice <= 0) {
      nextErrors.purchasePrice = 'Purchase price must be greater than 0';
    }

    if (!form.purchaseDate) nextErrors.purchaseDate = 'Purchase date is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      id: editEntry?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ticker: form.ticker.trim().toUpperCase(),
      companyName: form.companyName.trim(),
      quantity: Number(form.quantity),
      purchasePrice: Number(form.purchasePrice),
      purchaseDate: form.purchaseDate,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editEntry ? 'Edit Stock' : 'Add Stock to Portfolio'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Ticker"
            value={form.ticker}
            onChange={(e) => handleTickerChange(e.target.value)}
            error={Boolean(errors.ticker)}
            helperText={errors.ticker}
            fullWidth
          >
            {stockOptions.map((stock) => (
              <MenuItem key={stock.ticker} value={stock.ticker}>
                {stock.ticker} - {stock.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Company Name"
            value={form.companyName}
            onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
            error={Boolean(errors.companyName)}
            helperText={errors.companyName}
            fullWidth
          />

          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            fullWidth
          />

          <TextField
            label="Purchase Price"
            type="number"
            value={form.purchasePrice}
            onChange={(e) => setForm((prev) => ({ ...prev, purchasePrice: e.target.value }))}
            error={Boolean(errors.purchasePrice)}
            helperText={errors.purchasePrice}
            slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
            fullWidth
          />

          <TextField
            label="Date of Purchase"
            type="date"
            value={form.purchaseDate}
            onChange={(e) => setForm((prev) => ({ ...prev, purchaseDate: e.target.value }))}
            error={Boolean(errors.purchaseDate)}
            helperText={errors.purchaseDate}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {editEntry ? 'Save Changes' : 'Add Stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
