import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { mockPortfolio } from '../data/mockPortfolio';
import { PortfolioTable } from '../features/portfolio/PortfolioTable';
import { StockFormModal } from '../features/portfolio/StockFormModal';
import type { PortfolioEntry } from '../types/stock';

export function PortfolioPage() {
  const [entries, setEntries] = useState<PortfolioEntry[]>(mockPortfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStock = (entry: PortfolioEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setIsModalOpen(false);
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
          <PortfolioTable entries={entries} />
        </CardContent>
      </Card>
      <StockFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStock}
      />
    </Box>
  );
}
