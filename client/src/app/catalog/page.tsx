'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('pop');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);

  useEffect(() => {
    loadProducts();
  }, [category, search, sort, minPrice, maxPrice]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = { sort, minPrice, maxPrice };
      if (category) params.category = category;
      if (search) params.search = search;
      const data = await api.getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (newSort: string) => {
    setSort(newSort);
  };

  const applyFilters = () => {
    loadProducts();
  };

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-3 flex-wrap">
        <a href="/" className="text-[#CB11AB] cursor-pointer">Home</a>
        <span>›</span>
        <span className="text-gray-600">{category || 'All Products'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4">
        {/* Filter Panel */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 sticky top-[120px] h-fit hidden md:block">
          <h3 className="text-[15px] font-bold mb-3.5 pb-2 border-b border-gray-100">Filters</h3>
          
          <div className="mb-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Price (₽)</h4>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#CB11AB]"
                placeholder="from"
              />
              <span>—</span>
              <input 
                type="number" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#CB11AB]"
                placeholder="to"
              />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Brand</h4>
            <div className="flex flex-col gap-2">
              {['Samsung', 'Nike', 'Zara', 'Apple', 'Sony'].map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input type="checkbox" className="accent-[#CB11AB]" />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Rating</h4>
            <label className="flex items-center gap-2 cursor-pointer text-xs mb-1">
              <input type="radio" name="rating" /> 4★ and above
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs mb-1">
              <input type="radio" name="rating" /> 3★ and above
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input type="radio" name="rating" defaultChecked /> Any
            </label>
          </div>

          <button 
            onClick={applyFilters}
            className="w-full bg-[#CB11AB] text-white border-none py-2.5 rounded-lg font-bold cursor-pointer mt-2 hover:bg-[#9c0082]"
          >
            Apply Filters
          </button>
          <button 
            className="w-full bg-white border border-gray-200 py-2.5 rounded-lg cursor-pointer mt-1.5 text-gray-500"
          >
            Reset
          </button>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xl font-bold">{category || 'All Products'}</h2>
            <span className="text-xs text-gray-400">{products.length} products</span>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mb-3.5 flex-wrap">
            <span className="text-xs text-gray-400">Sort:</span>
            <button 
              onClick={() => handleSort('pop')}
              className={`border border-gray-200 bg-white rounded-full px-3.5 py-1.5 text-xs cursor-pointer ${sort === 'pop' ? 'bg-[#CB11AB] text-white border-[#CB11AB]' : 'text-gray-500'}`}
            >
              Popular
            </button>
            <button 
              onClick={() => handleSort('cheap')}
              className={`border border-gray-200 bg-white rounded-full px-3.5 py-1.5 text-xs cursor-pointer ${sort === 'cheap' ? 'bg-[#CB11AB] text-white border-[#CB11AB]' : 'text-gray-500'}`}
            >
              Cheapest first
            </button>
            <button 
              onClick={() => handleSort('expensive')}
              className={`border border-gray-200 bg-white rounded-full px-3.5 py-1.5 text-xs cursor-pointer ${sort === 'expensive' ? 'bg-[#CB11AB] text-white border-[#CB11AB]' : 'text-gray-500'}`}
            >
              Most expensive
            </button>
            <button 
              onClick={() => handleSort('rating')}
              className={`border border-gray-200 bg-white rounded-full px-3.5 py-1.5 text-xs cursor-pointer ${sort === 'rating' ? 'bg-[#CB11AB] text-white border-[#CB11AB]' : 'text-gray-500'}`}
            >
              By rating
            </button>
            <button 
              onClick={() => handleSort('new')}
              className={`border border-gray-200 bg-white rounded-full px-3.5 py-1.5 text-xs cursor-pointer ${sort === 'new' ? 'bg-[#CB11AB] text-white border-[#CB11AB]' : 'text-gray-500'}`}
            >
              New arrivals
            </button>
            <button 
              onClick={() => handleSort('disc')}
              className={`border border-gray-200 bg-white rounded-full px-3.5 py-1.5 text-xs cursor-pointer ${sort === 'disc' ? 'bg-[#CB11AB] text-white border-[#CB11AB]' : 'text-gray-500'}`}
            >
              By discount
            </button>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin text-2xl">⏳</div>
              <p className="text-gray-400 text-sm mt-2">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <main className="max-w-[1400px] mx-auto px-5 py-4">
        <div className="text-center py-12">
          <div className="animate-spin text-2xl">⏳</div>
          <p className="text-gray-400 text-sm mt-2">Loading...</p>
        </div>
      </main>
    }>
      <CatalogContent />
    </Suspense>
  );
}