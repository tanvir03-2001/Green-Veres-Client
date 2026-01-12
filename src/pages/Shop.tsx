import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { shopAPI } from '../services/api';

type Product = {
  _id?: string;
  name: string;
  price: number | string;
  description: string;
  stock: number | string;
  images?: string[];
  image?: string;
  category?: string;
  badge?: string;
};

const ShopPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await shopAPI.getProducts();
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const staticProducts: Product[] = [];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">GreenVerse Store</p>
            <h1 className="text-2xl font-bold text-gray-900">Everything for your garden in one place</h1>
            <p className="text-sm text-gray-600">Plants, tools, soil, and care—everything you need in one place.</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium">72 Hour Delivery</span>
              <span className="px-3 py-1 rounded-full bg-gray-100 font-medium">7 Day Return Window</span>
              <span className="px-3 py-1 rounded-full bg-gray-100 font-medium">Safe Packaging</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-xs text-gray-500">New Items</p>
              <p className="text-xl font-semibold text-green-700">{products.length}+</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-xs text-gray-500">Satisfied Customers</p>
              <p className="text-xl font-semibold text-green-700">5.0★</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-xs text-gray-500">Delivery Slots</p>
              <p className="text-xl font-semibold text-green-700">Daily</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Plants", "Tools", "Soil & Fertilizer", "Indoor", "Outdoor"].map((item) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                item === "All"
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-green-200 hover:text-green-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{typeof product.stock === 'number' ? (product.stock > 0 ? 'In Stock' : 'Out of Stock') : product.stock}</p>
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-6">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-700">৳{product.price}</span>
                      <button className="px-4 py-2 text-sm font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              staticProducts.map((product, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{product.stock}</p>
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      </div>
                      {product.badge && (
                        <span className="px-3 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-6">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-700">{product.price}</span>
                      <button className="px-4 py-2 text-sm font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Combo Offer</p>
            <h2 className="text-xl font-bold text-gray-900">Kitchen Garden Starter Kit</h2>
            <p className="text-sm text-gray-600">10 seed packets + organic fertilizer + spray bottle + guidebook.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-green-700">$29.99</span>
            <button className="px-4 py-2 text-sm font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition-colors">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
