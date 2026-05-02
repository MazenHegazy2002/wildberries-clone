const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All routes require VENDOR role
const vendorAuth = (req, res, next) => {
  if (req.user.role !== 'VENDOR' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Vendor access required' });
  }
  next();
};

// Dashboard
router.get('/dashboard', authMiddleware, vendorAuth, sellerController.getDashboard);

// Orders
router.get('/orders', authMiddleware, vendorAuth, sellerController.getOrders);
router.put('/orders/:id/status', authMiddleware, vendorAuth, sellerController.updateOrderStatus);

// Products
router.get('/products', authMiddleware, vendorAuth, sellerController.getProducts);
router.post('/products', authMiddleware, vendorAuth, sellerController.createProduct);
router.put('/products/:id', authMiddleware, vendorAuth, sellerController.updateProduct);
router.delete('/products/:id', authMiddleware, vendorAuth, sellerController.deleteProduct);

// Settings
router.get('/settings', authMiddleware, vendorAuth, sellerController.getSettings);
router.put('/settings', authMiddleware, vendorAuth, sellerController.updateSettings);

module.exports = router;