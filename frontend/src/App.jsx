// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header            from './Header';
import PlansOverview     from './PlansOverview';
import PlanDetail        from './PlanDetail';
import Login             from './Login';
import PinLogin          from './PinLogin';
import Register          from './Register';
import Dashboard         from './Dashboard';
import PrivateRoute      from './PrivateRoute';
import CustomerDashboard from './CustomerDashboard';
import Account           from './Account';
import TopUpPage         from './TopUpPage';
import ResetPin         from './ResetPin';
import AdminLogin            from './admin/AdminLogin';
import AdminDashboard        from './admin/AdminDashboard';
import AdminNetflixAccounts  from './admin/AdminNetflixAccounts';
import AdminNetflixAccounts50k from './admin/AdminNetflixAccounts50k';
import AdminRoute            from './admin/AdminRoute';
import AdminCustomerOrders   from './admin/AdminCustomerOrders';
import AdminStats            from './admin/AdminStats';
import AdminOrders           from './admin/AdminOrders';
import AdminLogs            from './admin/AdminLogs';
import AdminResetPin        from './admin/AdminResetPin';
import axios from 'axios';
import ContactInfo       from './ContactInfo';

import './App.css';

export default function App() {
  useEffect(() => {
    axios.post('/api/visit').catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <ContactInfo />
      <Routes>
        {/* ==== USER ROUTES (có Header) ==== */}
        <Route
          path="/"
          element={
            <HeaderWrapper>
              <PlansOverview />
            </HeaderWrapper>
          }
        />
        <Route
           path="/login"
           element={<Login />}
        />
        <Route
           path="/pin-login"
           element={<PinLogin />}
        />
        <Route
           path="/register"
           element={<Register />}
        />
        <Route
          path="/plan/:planKey"
          element={
            <HeaderWrapper>
              <PlanDetail />
            </HeaderWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <HeaderWrapper>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </HeaderWrapper>
          }
        />
        <Route
          path="/my-orders"
          element={
            <HeaderWrapper>
              <CustomerDashboard />
            </HeaderWrapper>
          }
        />
        <Route
          path="/top-up"
          element={
            <HeaderWrapper>
              <TopUpPage />
            </HeaderWrapper>
          }
        />
        <Route
          path="/reset-pin"
          element={
            <HeaderWrapper>
              <PrivateRoute>
                <ResetPin />
              </PrivateRoute>
            </HeaderWrapper>
          }
        />

        {/* ==== ADMIN ROUTES (không Header) ==== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminStats />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/netflix-accounts"
          element={
            <AdminRoute>
              <AdminNetflixAccounts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/netflix-accounts-50k"
          element={
            <AdminRoute>
              <AdminNetflixAccounts50k />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <AdminRoute>
              <AdminLogs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers/:id/orders"
          element={
            <AdminRoute>
              <AdminCustomerOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/customers/:id/reset-pin"
          element={
            <AdminRoute>
              <AdminResetPin />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

// Wrapper để render Header + padding chung cho các trang user
function HeaderWrapper({ children }) {
  return (
    <>
      <Header />
      <main className="main-content" style={{ paddingTop: '6rem' }}>
        {children}
      </main>
    </>
  );
}
