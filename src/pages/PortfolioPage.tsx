import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { mockPortfolio } from '../data/mockPortfolio';
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

  useEffect(() => {
    savePortfolioEntries(entries);
  }, [entries]);

  const handleSubmitStock = (entry: PortfolioEntry) => {
    setEntries((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === entry.id);
      if (existingIndex === -1) return [entry, ...prev];
      const next = [...prev];
      next[existingIndex] = entry;
      return next;
    });
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
    setDeleteTarget(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditEntry(null);
  };

  return (
    <Box>
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
          <PortfolioTable
            entries={entries}
            onEdit={handleEditStock}
            onDelete={setDeleteTarget}
          />
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
