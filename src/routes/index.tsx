import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { PortfolioPage } from '../pages/PortfolioPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route
          path="*"
          element={<div style={{ padding: '2rem' }}>404 — Page not found</div>}
        />
      </Route>
    </Routes>
  );
}
