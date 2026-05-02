const defaultProducts = [
  { id: '1', name: 'Electric Waffle Maker pro-847', brand: 'AHROR STORE', category: 'Appliances', price: 621, oldPrice: 16450, discount: 96, emoji: '🧇' },
  { id: '2', name: 'Samsung Galaxy S24 Ultra 256GB', brand: 'Samsung', category: 'Electronics', price: 89990, oldPrice: 112000, discount: 20, emoji: '📱' },
  { id: '3', name: "Nike Air Max 270 Women's", brand: 'Nike', category: 'Footwear', price: 7490, oldPrice: 11990, discount: 38, emoji: '👟' },
  { id: '4', name: "Women's Summer Floral Dress", brand: 'Zara', category: 'Women', price: 2990, oldPrice: 4590, discount: 35, emoji: '👗' },
  { id: '5', name: 'Apple MacBook Air M2 13"', brand: 'Apple', category: 'Electronics', price: 89990, oldPrice: 109000, discount: 17, emoji: '💻' },
  { id: '6', name: 'COSRX Korean Skincare Set', brand: 'COSRX', category: 'Beauty', price: 3490, oldPrice: 4999, discount: 30, emoji: '🧴' },
  { id: '7', name: 'Xiaomi Robot Vacuum S10+', brand: 'Xiaomi', category: 'Appliances', price: 29990, oldPrice: 39999, discount: 25, emoji: '🤖' },
  { id: '8', name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", category: 'Men', price: 4290, oldPrice: 6999, discount: 39, emoji: '👖' },
  { id: '9', name: 'LEGO Technic Bugatti Chiron', brand: 'LEGO', category: 'Toys', price: 8990, oldPrice: 12490, discount: 28, emoji: '🧱' },
  { id: '10', name: 'Adidas Ultraboost 22', brand: 'Adidas', category: 'Sports', price: 9990, oldPrice: 14990, discount: 33, emoji: '🏃' },
  { id: '11', name: 'Chanel N°5 EDP 100ml', brand: 'Chanel', category: 'Beauty', price: 18990, oldPrice: 24000, discount: 21, emoji: '🌸' },
  { id: '12', name: 'Cybex Balios S Lux Stroller', brand: 'Cybex', category: 'Kids', price: 54990, oldPrice: 74990, discount: 27, emoji: '🍼' },
];

// In-memory reviews storage
const reviews = new Map();

// Initialize with some mock reviews
const initReviews = () => {
  const mockReviews = [
    { productId: '1', userName: 'Alex M.', rating: 5, comment: 'Best waffle maker I have ever used! Makes perfect waffles every time.', isPinned: true },
    { productId: '1', userName: 'Sarah K.', rating: 4, comment: 'Great machine, easy to clean. Would recommend.', isPinned: false },
    { productId: '2', userName: 'TechGuy99', rating: 5, comment: 'Amazing phone! The camera is incredible. Battery lasts all day.', isPinned: true },
    { productId: '2', userName: 'MobileFan', rating: 4, comment: 'Great flagship. Expensive but worth it.', isPinned: false },
    { productId: '3', userName: 'FitnessPro', rating: 5, comment: 'Super comfortable! These are my go-to running shoes.', isPinned: true },
    { productId: '3', userName: 'ShoeLover', rating: 4, comment: 'Fits great, love the design.', isPinned: false },
    { productId: '5', userName: 'DevGuy', rating: 5, comment: 'Perfect for development work. M2 chip is blazing fast.', isPinned: true },
    { productId: '6', userName: 'SkincareAddict', rating: 5, comment: 'Life changing skincare! My skin has never looked better.', isPinned: true },
    { productId: '7', userName: 'CleanFreak', rating: 4, comment: 'Works great! Saves me so much time.', isPinned: false },
  ];

  mockReviews.forEach((review, index) => {
    const id = 'rev_' + (index + 1);
    if (!reviews.has(review.productId)) {
      reviews.set(review.productId, []);
    }
    reviews.get(review.productId).push({
      id,
      productId: review.productId,
      userId: 'user_' + index,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      isPinned: review.isPinned,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    });
  });
};

initReviews();

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const productReviews = reviews.get(productId) || [];
    
    // Sort: pinned first, then by date
    const sorted = [...productReviews].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json(sorted);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

const addReview = async (req, res) => {
  try {
    const userId = req.user?.userId || 'anonymous';
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    if (!reviews.has(productId)) {
      reviews.set(productId, []);
    }

    const productReviews = reviews.get(productId);
    
    // Check if user already reviewed
    const existing = productReviews.find(r => r.userId === userId);
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review = {
      id: 'rev_' + Date.now(),
      productId,
      userId,
      userName: 'You',
      rating,
      comment,
      isPinned: false,
      createdAt: new Date().toISOString(),
    };

    productReviews.push(review);
    res.status(201).json(review);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

module.exports = { getReviews, addReview };