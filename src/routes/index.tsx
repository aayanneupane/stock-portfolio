import { Routes, Route, Navigate } from 'react-router-dom';

/**
 * AppRoutes — central route registry.
 *
 * Add feature routes here as pages are built out.
 * Example structure:
 *   /auth        → LoginPage
 *   /dashboard   → DashboardPage
 *   /portfolio   → PortfolioPage
 *   /stocks      → StocksPage
 *   /transactions → TransactionsPage
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Placeholder: redirect root to /dashboard until pages are built */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={<div style={{ padding: '2rem' }}>Dashboard — coming soon</div>}
      />
      <Route
        path="*"
        element={<div style={{ padding: '2rem' }}>404 — Page not found</div>}
      />
    </Routes>
  );
}
