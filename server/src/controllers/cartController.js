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

// In-memory cart storage (for demo - no PostgreSQL required)
const carts = new Map();

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userCart = carts.get(userId) || [];
    
    const cartWithProducts = userCart.map(item => {
      const product = defaultProducts.find(p => p.id === item.productId);
      return {
        ...item,
        product,
      };
    });

    res.json(cartWithProducts);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = defaultProducts.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Initialize user cart
    if (!carts.has(userId)) {
      carts.set(userId, []);
    }

    const userCart = carts.get(userId);
    const existingItem = userCart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userCart.push({
        id: 'cart_' + Date.now(),
        productId,
        quantity,
      });
    }

    res.json({ message: 'Added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    const userCart = carts.get(userId) || [];
    const item = userCart.find(item => item.id === id);

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    item.quantity = quantity;
    res.json(item);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const userCart = carts.get(userId) || [];
    const index = userCart.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    userCart.splice(index, 1);
    res.json({ message: 'Removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    carts.delete(userId);
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };