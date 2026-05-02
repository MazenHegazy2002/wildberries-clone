const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

router.get('/:productId/reviews', reviewController.getReviews);
router.post('/:productId/reviews', authMiddleware, reviewController.addReview);

module.exports = router;