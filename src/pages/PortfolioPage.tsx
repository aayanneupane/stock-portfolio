import { Box, Card, CardContent, Typography } from '@mui/material';
import { mockPortfolio } from '../data/mockPortfolio';
import { PortfolioTable } from '../features/portfolio/PortfolioTable';

export function PortfolioPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Portfolio
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <PortfolioTable entries={mockPortfolio} />
        </CardContent>
      </Card>
    </Box>
  );
}
