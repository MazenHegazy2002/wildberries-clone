const defaultProducts = [
  { id: '1', name: 'Electric Waffle Maker pro-847', brand: 'AHROR STORE', category: 'Appliances', price: 621, oldPrice: 16450, discount: 96, rating: 4.8, reviewCount: 2567, soldCount: 34521, stock: 87, isNew: false, isSale: true, emoji: '🧇' },
  { id: '2', name: 'Samsung Galaxy S24 Ultra 256GB', brand: 'Samsung', category: 'Electronics', price: 89990, oldPrice: 112000, discount: 20, rating: 4.8, reviewCount: 1248, soldCount: 34521, stock: 87, isSale: true, emoji: '📱' },
  { id: '3', name: "Nike Air Max 270 Women's", brand: 'Nike', category: 'Footwear', price: 7490, oldPrice: 11990, discount: 38, rating: 4.6, reviewCount: 3421, soldCount: 89234, stock: 145, isSale: true, emoji: '👟' },
  { id: '4', name: "Women's Summer Floral Dress", brand: 'Zara', category: 'Women', price: 2990, oldPrice: 4590, discount: 35, rating: 4.5, reviewCount: 892, soldCount: 12300, stock: 234, isNew: true, emoji: '👗' },
  { id: '5', name: 'Apple MacBook Air M2 13"', brand: 'Apple', category: 'Electronics', price: 89990, oldPrice: 109000, discount: 17, rating: 4.9, reviewCount: 2134, soldCount: 45678, stock: 42, isSale: true, emoji: '💻' },
  { id: '6', name: 'COSRX Korean Skincare Set', brand: 'COSRX', category: 'Beauty', price: 3490, oldPrice: 4999, discount: 30, rating: 4.7, reviewCount: 5621, soldCount: 78900, stock: 320, isNew: true, emoji: '🧴' },
  { id: '7', name: 'Xiaomi Robot Vacuum S10+', brand: 'Xiaomi', category: 'Appliances', price: 29990, oldPrice: 39999, discount: 25, rating: 4.7, reviewCount: 3201, soldCount: 15678, stock: 56, isSale: true, emoji: '🤖' },
  { id: '8', name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", category: 'Men', price: 4290, oldPrice: 6999, discount: 39, rating: 4.6, reviewCount: 1876, soldCount: 23456, stock: 98, isSale: true, emoji: '👖' },
  { id: '9', name: 'LEGO Technic Bugatti Chiron', brand: 'LEGO', category: 'Toys', price: 8990, oldPrice: 12490, discount: 28, rating: 4.9, reviewCount: 1245, soldCount: 34567, stock: 67, isSale: true, emoji: '🧱' },
  { id: '10', name: 'Adidas Ultraboost 22', brand: 'Adidas', category: 'Sports', price: 9990, oldPrice: 14990, discount: 33, rating: 4.7, reviewCount: 2341, soldCount: 45678, stock: 112, isSale: true, emoji: '🏃' },
  { id: '11', name: 'Chanel N°5 EDP 100ml', brand: 'Chanel', category: 'Beauty', price: 18990, oldPrice: 24000, discount: 21, rating: 4.9, reviewCount: 4321, soldCount: 23456, stock: 45, isSale: true, emoji: '🌸' },
  { id: '12', name: 'Cybex Balios S Lux Stroller', brand: 'Cybex', category: 'Kids', price: 54990, oldPrice: 74990, discount: 27, rating: 4.8, reviewCount: 678, soldCount: 5432, stock: 18, isSale: true, emoji: '🍼' },
];

// In-memory stores
const vendorProducts = new Map();
const vendorOrders = new Map();

// Initialize vendor products
const initVendorData = () => {
  // Nike store products
  const nikeProducts = defaultProducts.filter(p => p.brand === 'Nike' || p.brand === 'Adidas');
  vendorProducts.set('vnd_1', nikeProducts.map(p => ({ ...p, vendorId: 'vnd_1' })));
  
  // Samsung store products
  const samsungProducts = defaultProducts.filter(p => p.brand === 'Samsung' || p.brand === 'Apple');
  vendorProducts.set('vnd_2', samsungProducts.map(p => ({ ...p, vendorId: 'vnd_2' })));
};

initVendorData();

// Get dashboard stats
const getDashboard = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    
    const orders = Array.from(vendorOrders.values()).filter(o => o.vendorId === vendorId);
    const products = vendorProducts.get(vendorId) || [];
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
    
    // Orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    
    // Recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    res.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalSold,
        averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      },
      ordersByStatus,
      recentOrders,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
};

// Get vendor orders
const getOrders = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    const { status } = req.query;
    
    let orders = Array.from(vendorOrders.values()).filter(o => o.vendorId === vendorId);
    
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    const { id } = req.params;
    const { status } = req.body;
    
    const order = Array.from(vendorOrders.values()).find(o => o.id === id && o.vendorId === vendorId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    vendorOrders.set(id, order);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Get vendor products
const getProducts = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    const products = vendorProducts.get(vendorId) || [];
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    const products = vendorProducts.get(vendorId) || [];
    
    const product = {
      id: 'prod_' + Date.now(),
      vendorId,
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    
    products.push(product);
    vendorProducts.set(vendorId, products);
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    const { id } = req.params;
    const products = vendorProducts.get(vendorId) || [];
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[index] = { ...products[index], ...req.body };
    vendorProducts.set(vendorId, products);
    
    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    const { id } = req.params;
    const products = vendorProducts.get(vendorId) || [];
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products.splice(index, 1);
    vendorProducts.set(vendorId, products);
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Get vendor settings
const getSettings = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    
    const settings = {
      storeName: vendorId === 'vnd_1' ? 'Nike Store' : 'Samsung Official',
      description: 'Official store',
      logo: '🏪',
      banner: '',
      commission: 0.10,
      payoutSchedule: 'weekly',
      notificationEmail: true,
    };
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const vendorId = req.vendor?.id || 'vnd_1';
    const { storeName, description, logo, banner, notificationEmail } = req.body;
    
    const settings = {
      storeName: storeName || 'Nike Store',
      description: description || 'Official store',
      logo: logo || '🏪',
      banner: banner || '',
      commission: 0.10,
      payoutSchedule: 'weekly',
      notificationEmail: notificationEmail !== false,
    };
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

module.exports = {
  getDashboard,
  getOrders,
  updateOrderStatus,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSettings,
  updateSettings,
};