import React from 'react';
import ThemeProvider from './components/ThemeProvider';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentsList from './pages/Payments/List';
import DebtsList from './pages/Debts/List';
import PropertiesList from './pages/Properties/List';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payments" element={<PaymentsList />} />
              <Route path="/debts" element={<DebtsList />} />
              <Route path="/properties" element={<PropertiesList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
} 