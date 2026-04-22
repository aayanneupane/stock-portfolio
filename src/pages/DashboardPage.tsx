import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { mockStocks } from '../data/mockStocks';
import { StockLineChart } from '../features/dashboard/StockLineChart';
import { StockColumnChart } from '../features/dashboard/StockColumnChart';

export function DashboardPage() {
  const [selectedTicker, setSelectedTicker] = useState<string>(mockStocks[0].ticker);

  const selectedStock = mockStocks.find((s) => s.ticker === selectedTicker);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Market Dashboard
        </Typography>

        <FormControl sx={{ minWidth: 220 }} size="medium">
          <InputLabel id="stock-select-label">Select Stock</InputLabel>
          <Select
            labelId="stock-select-label"
            value={selectedTicker}
            label="Select Stock"
            onChange={(e) => setSelectedTicker(e.target.value)}
          >
            {mockStocks.map((stock) => (
              <MenuItem key={stock.ticker} value={stock.ticker}>
                {stock.ticker} — {stock.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedStock && (
        <Grid container spacing={3}>
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
      )}
    </Box>
  );
}
