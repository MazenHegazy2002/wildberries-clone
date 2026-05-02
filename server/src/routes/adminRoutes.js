const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All routes require ADMIN role

// Analytics
router.get('/analytics', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.getAnalytics);

// Users
router.get('/users', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.getUsers);

router.put('/users/:id/role', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.updateUserRole);

router.delete('/users/:id', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.deleteUser);

// Vendors
router.get('/vendors', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.getVendors);

router.put('/vendors/:id/approve', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.approveVendor);

// Orders (admin view)
router.get('/orders', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.getAllOrders);

router.put('/orders/:id/status', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.updateOrderStatus);

// Products
router.get('/products', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.getAllProducts);

router.post('/products', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.createProduct);

router.put('/products/:id', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.updateProduct);

router.delete('/products/:id', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, adminController.deleteProduct);

module.exports = router;