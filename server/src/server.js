const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const addressRoutes = require('./routes/addressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);

app.get('/api/categories', (req, res) => {
  const categories = [
    { id: '1', name: 'Women', slug: 'women', icon: '👗' },
    { id: '2', name: 'Men', slug: 'men', icon: '👔' },
    { id: '3', name: 'Kids', slug: 'kids', icon: '🧸' },
    { id: '4', name: 'Electronics', slug: 'electronics', icon: '📱' },
    { id: '5', name: 'Home', slug: 'home', icon: '🏠' },
    { id: '6', name: 'Beauty', slug: 'beauty', icon: '💄' },
    { id: '7', name: 'Sports', slug: 'sports', icon: '⚽' },
    { id: '8', name: 'Footwear', slug: 'footwear', icon: '👟' },
    { id: '9', name: 'Appliances', slug: 'appliances', icon: '🍳' },
    { id: '10', name: 'Toys', slug: 'toys', icon: '🧩' },
  ];
  res.json(categories);
});

app.get('/', (req, res) => {
  res.send('Wildberries Clone API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});