// Admin Controller - Full management dashboard
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

// In-memory data stores
const users = new Map();
const orders = new Map();
const vendors = new Map();

// Initialize with demo data
const initAdminData = () => {
  // Add demo users
  const demoUsers = [
    { id: 'usr_1', email: 'admin@wb.com', name: 'Admin User', role: 'ADMIN', phone: '+79001234567', createdAt: new Date().toISOString() },
    { id: 'usr_2', email: 'seller1@store.com', name: 'Nike Store', role: 'VENDOR', phone: '+79001234568', createdAt: new Date().toISOString() },
    { id: 'usr_3', email: 'seller2@store.com', name: 'Samsung Official', role: 'VENDOR', phone: '+79001234569', createdAt: new Date().toISOString() },
    { id: 'usr_4', email: 'buyer@example.com', name: 'John Buyer', role: 'USER', phone: '+79001234570', createdAt: new Date().toISOString() },
  ];
  demoUsers.forEach(u => users.set(u.id, { ...u, password: '$2a$10$demo' }));

  // Add demo vendors
  const demoVendors = [
    { id: 'vnd_1', userId: 'usr_2', storeName: 'Nike Store', rating: 4.7, productsCount: 156, ordersCount: 8923, approved: true, createdAt: new Date().toISOString() },
    { id: 'vnd_2', userId: 'usr_3', storeName: 'Samsung Official', rating: 4.9, productsCount: 89, ordersCount: 15678, approved: true, createdAt: new Date().toISOString() },
  ];
  demoVendors.forEach(v => vendors.set(v.id, v));

  // Add demo orders
  const demoOrders = [
    { id: 'ord_1', userId: 'usr_4', vendorId: 'vnd_1', status: 'delivered', total: 7490, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 'ord_2', userId: 'usr_4', vendorId: 'vnd_2', status: 'shipped', total: 89990, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'ord_3', userId: 'usr_4', vendorId: 'vnd_1', status: 'processing', total: 2990, createdAt: new Date().toISOString() },
  ];
  demoOrders.forEach(o => orders.set(o.id, o));
};

initAdminData();

// Analytics
const getAnalytics = async (req, res) => {
  try {
    const allOrders = Array.from(orders.values());
    const allUsers = Array.from(users.values());
    const allVendors = Array.from(vendors.values());
    
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = allOrders.length;
    const totalUsers = allUsers.filter(u => u.role === 'USER').length;
    const totalVendors = allVendors.length;
    
    // Orders by status
    const ordersByStatus = {
      pending: allOrders.filter(o => o.status === 'pending').length,
      processing: allOrders.filter(o => o.status === 'processing').length,
      shipped: allOrders.filter(o => o.status === 'shipped').length,
      delivered: allOrders.filter(o => o.status === 'delivered').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
    };
    
    // Recent orders
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
    
    // Top products
    const topProducts = [...defaultProducts]
      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      .slice(0, 5);
    
    res.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalVendors,
        averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      },
      ordersByStatus,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

// Users management
const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let allUsers = Array.from(users.values());
    
    if (role) {
      allUsers = allUsers.filter(u => u.role === role);
    }
    
    if (search) {
      const s = search.toLowerCase();
      allUsers = allUsers.filter(u => 
        u.name?.toLowerCase().includes(s) || 
        u.email?.toLowerCase().includes(s)
      );
    }
    
    // Remove passwords
    const safeUsers = allUsers.map(({ password, ...u }) => u);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = users.get(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.role = role;
    users.set(id, user);
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!users.has(id)) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users.delete(id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Vendors management
const getVendors = async (req, res) => {
  try {
    const { approved } = req.query;
    let allVendors = Array.from(vendors.values());
    
    if (approved !== undefined) {
      allVendors = allVendors.filter(v => v.approved === (approved === 'true'));
    }
    
    res.json(allVendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get vendors' });
  }
};

const approveVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    
    const vendor = vendors.get(id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    vendor.approved = approved;
    vendors.set(id, vendor);
    
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve vendor' });
  }
};

// All orders (admin view)
const getAllOrders = async (req, res) => {
  try {
    const { status, vendorId } = req.query;
    let allOrders = Array.from(orders.values());
    
    if (status) {
      allOrders = allOrders.filter(o => o.status === status);
    }
    
    if (vendorId) {
      allOrders = allOrders.filter(o => o.vendorId === vendorId);
    }
    
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = orders.get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    orders.set(id, order);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Products management
const getAllProducts = async (req, res) => {
  try {
    const { category, search, vendorId } = req.query;
    let products = [...defaultProducts];
    
    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    if (search) {
      const s = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.brand.toLowerCase().includes(s)
      );
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = {
      id: 'prod_' + Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    
    defaultProducts.push(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const index = defaultProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    defaultProducts[index] = { ...defaultProducts[index], ...req.body };
    res.json(defaultProducts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const index = defaultProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    defaultProducts.splice(index, 1);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getVendors,
  approveVendor,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};