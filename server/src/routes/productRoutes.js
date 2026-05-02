const express = require('express');
const router = express.Router();

const defaultProducts = [
  { id: '1', name: 'Electric Waffle Maker pro-847', brand: 'AHROR STORE', category: 'Appliances', subcategory: 'Kitchen Appliances', price: 621, oldPrice: 16450, discount: 96, rating: 4.8, reviewCount: 2567, soldCount: 34521, stock: 87, isNew: false, isSale: true, article: '677539715', model: 'pro-847', seller: 'AHROR STORE', sellerRating: 4.8, description: 'Electric waffle maker with non-stick coating for crispy Vienna-style waffles. Fast heating, easy cleaning, compact size.', colors: ['Red', 'Black', 'White'], sizes: ['Standard'], images: ['🧇', '🍽️', '⚡', '📦'], emoji: '🧇' },
  { id: '2', name: 'Samsung Galaxy S24 Ultra 256GB', brand: 'Samsung', category: 'Electronics', subcategory: 'Smartphones', price: 89990, oldPrice: 112000, discount: 20, rating: 4.8, reviewCount: 1248, soldCount: 34521, stock: 87, isSale: true, emoji: '📱', seller: 'Samsung Official', sellerRating: 4.9, description: 'Galaxy S24 Ultra with 200MP camera, S Pen, and AI features.', colors: ['Black', 'White', 'Violet'], sizes: ['256GB', '512GB', '1TB'] },
  { id: '3', name: "Nike Air Max 270 Women's", brand: 'Nike', category: 'Footwear', subcategory: 'Sneakers', price: 7490, oldPrice: 11990, discount: 38, rating: 4.6, reviewCount: 3421, soldCount: 89234, stock: 145, isSale: true, emoji: '👟', seller: 'Nike Store', sellerRating: 4.7, description: 'Iconic Air Max with 270° Air unit for maximum comfort.', colors: ['White', 'Black', 'Pink'], sizes: ['36', '37', '38', '39', '40', '41'] },
  { id: '4', name: "Women's Summer Floral Dress", brand: 'Zara', category: 'Women', subcategory: 'Dresses', price: 2990, oldPrice: 4590, discount: 35, rating: 4.5, reviewCount: 892, soldCount: 12300, stock: 234, isNew: true, emoji: '👗', seller: 'Zara Official', sellerRating: 4.6, description: 'Elegant floral dress perfect for summer occasions.', colors: ['Blue', 'Pink', 'White'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: '5', name: 'Apple MacBook Air M2 13"', brand: 'Apple', category: 'Electronics', subcategory: 'Laptops', price: 89990, oldPrice: 109000, discount: 17, rating: 4.9, reviewCount: 2134, soldCount: 45678, stock: 42, isSale: true, emoji: '💻', seller: 'Apple Premium', sellerRating: 4.9, description: 'Supercharged by M2 chip. Fanless design. All-day battery life.', colors: ['Space Gray', 'Silver', 'Midnight'], sizes: ['256GB', '512GB', '1TB'] },
  { id: '6', name: 'COSRX Korean Skincare Set', brand: 'COSRX', category: 'Beauty', subcategory: 'Face Care', price: 3490, oldPrice: 4999, discount: 30, rating: 4.7, reviewCount: 5621, soldCount: 78900, stock: 320, isNew: true, emoji: '🧴', seller: 'Korean Beauty', sellerRating: 4.8, description: 'Complete 10-step Korean skincare routine for glowing skin.', colors: ['Default'], sizes: ['Set'] },
  { id: '7', name: 'Xiaomi Robot Vacuum S10+', brand: 'Xiaomi', category: 'Appliances', subcategory: 'Vacuum Cleaners', price: 29990, oldPrice: 39999, discount: 25, rating: 4.7, reviewCount: 3201, soldCount: 15678, stock: 56, isSale: true, emoji: '🤖', seller: 'Xiaomi Official', sellerRating: 4.8, description: 'Smart robot vacuum with LDS navigation and auto-empty station.', colors: ['White'], sizes: ['Standard'] },
  { id: '8', name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", category: 'Men', subcategory: 'Jeans', price: 4290, oldPrice: 6999, discount: 39, rating: 4.6, reviewCount: 1876, soldCount: 23456, stock: 98, isSale: true, emoji: '👖', seller: "Levi's Official", sellerRating: 4.7, description: 'Classic slim fit jeans with stretch comfort.', colors: ['Indigo', 'Black', 'Light Blue'], sizes: ['28', '30', '32', '34', '36'] },
  { id: '9', name: 'LEGO Technic Bugatti Chiron', brand: 'LEGO', category: 'Toys', subcategory: 'Construction Sets', price: 8990, oldPrice: 12490, discount: 28, rating: 4.9, reviewCount: 1245, soldCount: 34567, stock: 67, isSale: true, emoji: '🧱', seller: 'LEGO Official', sellerRating: 4.9, description: 'Detailed replica of the Bugatti Chiron with moving parts.', colors: ['Default'], sizes: ['3638 pcs'] },
  { id: '10', name: 'Adidas Ultraboost 22', brand: 'Adidas', category: 'Sports', subcategory: 'Running Shoes', price: 9990, oldPrice: 14990, discount: 33, rating: 4.7, reviewCount: 2341, soldCount: 45678, stock: 112, isSale: true, emoji: '🏃', seller: 'Adidas Store', sellerRating: 4.7, description: 'Premium running shoes with Boost cushioning technology.', colors: ['Black/White', 'Core Black', 'Cloud White'], sizes: ['40', '41', '42', '43', '44', '45'] },
  { id: '11', name: 'Chanel N°5 EDP 100ml', brand: 'Chanel', category: 'Beauty', subcategory: 'Perfumes', price: 18990, oldPrice: 24000, discount: 21, rating: 4.9, reviewCount: 4321, soldCount: 23456, stock: 45, isSale: true, emoji: '🌸', seller: 'Chanel Boutique', sellerRating: 4.9, description: 'The iconic fragrance for women since 1921.', colors: ['Default'], sizes: ['50ml', '100ml'] },
  { id: '12', name: 'Cybex Balios S Lux Stroller', brand: 'Cybex', category: 'Kids', subcategory: 'Strollers', price: 54990, oldPrice: 74990, discount: 27, rating: 4.8, reviewCount: 678, soldCount: 5432, stock: 18, isSale: true, emoji: '🍼', seller: 'Cybex Official', sellerRating: 4.8, description: 'Premium stroller with one-hand fold and all-terrain wheels.', colors: ['Deep Black', 'Navy Blue', 'Rosa'], sizes: ['Standard'] },
];

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

// Helper function for other controllers
const getProducts = () => [...defaultProducts];

router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, limit = 50, offset = 0 } = req.query;
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

    if (minPrice) {
      products = products.filter(p => p.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseInt(maxPrice));
    }

    switch (sort) {
      case 'cheap':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'expensive':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'disc':
        products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }

    const start = parseInt(offset);
    const end = start + parseInt(limit);
    products = products.slice(start, end);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = defaultProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
module.exports.getProducts = getProducts;