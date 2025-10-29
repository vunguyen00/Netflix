import { Router } from 'express';
import { authenticateAdmin, authorizeRoles } from '../middleware/auth.js';
import {
  login,
  ordersStream,
  getCustomers,
  getCustomer,
  topupCustomer,
  resetCustomerPin,
  deleteCustomer,
  getCustomerOrders,
  getOrders,
  deleteOrder,
  getOrderHistory,
  getNetflixAccounts,
  createNetflixAccount,
  updateNetflixAccount,
  assignProfile,
  updateProfile,
  deleteNetflixAccount,
  deleteProfile,
  transferProfile,
  stats,
  getAdminLogs
} from '../controllers/adminController.js';

// import { getExpiringOrders } from '../controllers/orderController.js';

const router = Router();

/* ========== AUTH ========== */
router.post('/login', login);

/* ========== ORDERS ========== */
router.get('/orders/stream', authenticateAdmin, ordersStream); // thêm auth
router.get('/orders', authenticateAdmin, getOrders);
// router.get('/orders/expiring', authenticateAdmin, getExpiringOrders);
router.get('/orders/:id/history', authenticateAdmin, getOrderHistory);
router.delete('/orders/:id', authenticateAdmin, deleteOrder);

/* ========== CUSTOMERS ========== */
router.get('/customers', authenticateAdmin, getCustomers);
router.get('/customers/:id', authenticateAdmin, getCustomer);

// === TOPUP ===
// PATCH chuẩn RESTful
router.patch(
  '/customers/:id/topup',
  authenticateAdmin,
  // authorizeRoles('superadmin'),
  topupCustomer
);

// POST tương thích frontend cũ
router.post(
  '/customers/:id/topup',
  authenticateAdmin,
  // authorizeRoles('superadmin'),
  topupCustomer
);

router.patch('/customers/:id/reset-pin', authenticateAdmin, authorizeRoles('superadmin'), resetCustomerPin);
router.delete('/customers/:id', authenticateAdmin, authorizeRoles('superadmin'), deleteCustomer);
router.get('/customers/:id/orders', authenticateAdmin, getCustomerOrders);

/* ========== NETFLIX ACCOUNTS ========== */
router.get('/netflix-accounts', authenticateAdmin, getNetflixAccounts);
router.post('/netflix-accounts', authenticateAdmin, createNetflixAccount);
router.put('/netflix-accounts/:id', authenticateAdmin, updateNetflixAccount);
router.delete('/netflix-accounts/:id', authenticateAdmin, deleteNetflixAccount);
router.post('/netflix-accounts/:id/assign', authenticateAdmin, assignProfile);
router.put('/netflix-accounts/:accountId/profiles/:profileId', authenticateAdmin, updateProfile);
router.delete('/netflix-accounts/:accountId/profiles/:profileId', authenticateAdmin, deleteProfile);
router.post('/netflix-accounts/:accountId/profiles/:profileId/transfer', authenticateAdmin, transferProfile);

/* ========== STATS & LOGS ========== */
router.get('/stats', authenticateAdmin, stats);
router.get('/logs', authenticateAdmin, authorizeRoles('superadmin'), getAdminLogs);

export default router;
