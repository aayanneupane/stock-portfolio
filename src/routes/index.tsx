import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="*"
        element={<div style={{ padding: '2rem' }}>404 — Page not found</div>}
      />
    </Routes>
  );
}
