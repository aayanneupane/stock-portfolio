import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { mockPortfolio } from '../data/mockPortfolio';
import { mockStocks } from '../data/mockStocks';
import { StockLineChart } from '../features/dashboard/StockLineChart';
import { StockColumnChart } from '../features/dashboard/StockColumnChart';
import { PortfolioTable } from '../features/portfolio/PortfolioTable';
import { StockFormModal } from '../features/portfolio/StockFormModal';
import { ConfirmDeleteDialog } from '../features/portfolio/ConfirmDeleteDialog';
import type { PortfolioEntry } from '../types/stock';
import { loadPortfolioEntries, savePortfolioEntries } from '../utils/portfolioStorage';

export function PortfolioPage() {
  const [entries, setEntries] = useState<PortfolioEntry[]>(() => loadPortfolioEntries(mockPortfolio));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PortfolioEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioEntry | null>(null);
  const [selectedTicker, setSelectedTicker] = useState<string>('');

  useEffect(() => {
    const ok = savePortfolioEntries(entries);
    if (!ok) toast.error('Could not save portfolio (storage full or blocked).');
    if (!selectedTicker && entries.length) setSelectedTicker(entries[0].ticker);
    if (selectedTicker && entries.length === 0) setSelectedTicker('');
  }, [entries]);

  const handleSubmitStock = (entry: PortfolioEntry) => {
    const isEdit = entries.some((e) => e.id === entry.id);
    setEntries((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === entry.id);
      if (existingIndex === -1) return [entry, ...prev];
      const next = [...prev];
      next[existingIndex] = entry;
      return next;
    });
    setSelectedTicker(entry.ticker);
    toast.success(isEdit ? 'Stock updated' : 'Stock added');
    setIsModalOpen(false);
    setEditEntry(null);
  };

  const handleEditStock = (entry: PortfolioEntry) => {
    setEditEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteStock = () => {
    if (!deleteTarget) return;
    setEntries((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    toast.success('Stock removed');
    if (deleteTarget.ticker === selectedTicker) {
      const remaining = entries.filter((e) => e.id !== deleteTarget.id);
      setSelectedTicker(remaining[0]?.ticker ?? '');
    }
    setDeleteTarget(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditEntry(null);
  };

  const selectedStock = mockStocks.find((s) => s.ticker === selectedTicker);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Performance
        </Typography>
        {selectedStock ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <StockLineChart ticker={selectedStock.ticker} data={selectedStock.history} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <StockColumnChart ticker={selectedStock.ticker} data={selectedStock.history} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Select a stock in your portfolio to see charts (mock history is available for some tickers).
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1">
          My Portfolio
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
          Add Stock
        </Button>
      </Box>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          {entries.length === 0 ? (
            <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                No stocks in your portfolio yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first stock to start tracking performance.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                Add Stock
              </Button>
            </Box>
          ) : (
            <PortfolioTable
              entries={entries}
              onEdit={handleEditStock}
              onDelete={setDeleteTarget}
              selectedTicker={selectedTicker}
              onSelectTicker={setSelectedTicker}
            />
          )}
        </CardContent>
      </Card>
      <StockFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitStock}
        editEntry={editEntry}
      />
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        stockLabel={
          deleteTarget ? `${deleteTarget.ticker} - ${deleteTarget.companyName}` : 'this stock'
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteStock}
      />
    </Box>
  );
}
