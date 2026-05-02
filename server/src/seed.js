const fs = require('fs');
const path = require('path');

const data = require('../data.json');

function transformProduct(p) {
  return {
    name: p.name,
    brand: p.brand,
    category: p.cat,
    subcategory: p.subcat,
    price: p.price,
    old_price: p.old,
    discount: p.disc,
    rating: p.rat,
    review_count: p.revs,
    sold_count: p.sold,
    emoji: p.ico,
    colors: JSON.stringify(p.colors),
    sizes: JSON.stringify(p.sizes),
    stock: p.stock,
    is_new: p.isNew,
    is_sale: p.isSale,
    article: p.art,
    model: p.model,
    seller: p.seller,
    seller_rating: p.sellerRat,
    description: p.desc,
    specs: JSON.stringify(p.specs),
    images: JSON.stringify(p.imgs),
    tags: JSON.stringify(p.tags),
  };
}

const pool = require('./config/db');

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Seeding database with data.json...');
    
    // Clear existing data
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM cart_items');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM users');
    
    // Create demo user
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('demo123', 10);
    await client.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
      ['demo@example.com', hashedPassword, 'Demo User', 'USER']
    );
    console.log('✓ Created demo user');
    
    // Create categories
    const categoryMap = new Map();
    for (const cat of data.categories || []) {
      const result = await client.query(
        'INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) RETURNING id',
        [cat.name, cat.name.toLowerCase(), cat.ico]
      );
      categoryMap.set(cat.name, result.rows[0].id);
    }
    console.log(`✓ Created ${data.categories?.length || 0} categories`);
    
    // Create products
    for (const p of data.products || []) {
      const productData = transformProduct(p);
      await client.query(
        `INSERT INTO products (name, brand, category, subcategory, price, old_price, discount, rating, review_count, sold_count, emoji, colors, sizes, stock, is_new, is_sale, article, model, seller, seller_rating, description, specs, images, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
        [
          productData.name,
          productData.brand,
          productData.category,
          productData.subcategory,
          productData.price,
          productData.old_price,
          productData.discount,
          productData.rating,
          productData.review_count,
          productData.sold_count,
          productData.emoji,
          productData.colors,
          productData.sizes,
          productData.is_new,
          productData.is_sale,
          productData.article,
          productData.model,
          productData.seller,
          productData.seller_rating,
          productData.description,
          productData.specs,
          productData.images,
          productData.tags,
        ]
      );
    }
    console.log(`✓ Created ${data.products?.length || 0} products`);
    
    console.log('');
    console.log('========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('');
    console.log('Demo Login:');
    console.log('  Email: demo@example.com');
    console.log('  Password: demo123');
    console.log('');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();