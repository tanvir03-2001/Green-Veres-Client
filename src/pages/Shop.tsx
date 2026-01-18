import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { shopAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router';
import { Search, Star, Package, Filter, X, Store, Tag, ShoppingCart, Zap, Heart } from 'lucide-react';

type Product = {
  _id?: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  seller?: string;
  featured?: boolean;
  tags?: string[];
};

const categories = ['All', 'Plants', 'Tools', 'Soil & Fertilizer', 'Indoor', 'Outdoor', 'Seeds', 'Pots', 'Accessories'];

const ShopPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'rating'>('createdAt');


  
  const { state, addItem, removeItem } = useCart();
  const navigate = useNavigate();

  // Check if product is already in cart
  const isInCart = (productId: string) => {
    return state.items.some(item => item.productId === productId);
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await shopAPI.getProducts({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sortBy,
        order: sortBy === 'price' ? 'asc' : 'desc',
      });
      if (response.success) {
        setProducts(response.data.products || []);
        console.log('Loaded products:', response.data.products?.length || 0);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-full bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          {/* Compact Title and Search Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">GreenVerse Shop</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Everything for your garden</p>
              </div>
            </div>
            
            {/* Compact Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Compact Sort Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-green-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'price' | 'rating')}
                className="text-xs bg-transparent focus:outline-none cursor-pointer text-gray-700"
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Compact Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Compact Results Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${products.length} products`}
            </p>
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                {selectedCategory}
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>Quality</span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-xs w-full">
              <div className="relative inline-block mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 mx-auto"></div>
                <div className="absolute top-0 left-0 animate-spin rounded-full h-12 w-12 border-4 border-t-green-600 border-r-transparent border-b-transparent border-l-transparent"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Products</h3>
              <p className="text-gray-500 text-sm">Finding the best gardening essentials for you...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md w-full">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory !== 'All' || searchQuery 
                  ? 'Try adjusting your filters or search terms' 
                  : 'No shops have added products yet. Be the first to create a shop!'
                }
              </p>
              {(selectedCategory !== 'All' || searchQuery) && (
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  View All Products
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => {
                  if (product._id) {
                    navigate(`/product/${product._id}`);
                  }
                }}
                className="rounded-xl bg-white border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-200"
              >
                {/* Image section */}
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50">
                  <button className="absolute top-2.5 right-2.5 rounded-full bg-white/90 p-1.5 backdrop-blur-sm hover:bg-white transition-all shadow-sm">
                    <Heart className="h-3.5 w-3.5 text-gray-500 hover:text-red-500 transition-colors" />
                  </button>
                
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
                    }
                    alt={product.name}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                                  
                  {/* Stock Badge */}
                  {product.stock === 0 ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="px-2.5 py-1 bg-red-500 text-white font-bold rounded text-xs">OUT OF STOCK</span>
                    </div>
                  ) : product.stock < 10 && (
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="px-2 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full shadow-sm">
                        {product.stock} left
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Content section */}
                <div className="p-3.5">
                  <h3 className="font-semibold text-gray-900 truncate text-sm leading-tight">
                    {product.name}
                  </h3>
                
                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 h-10">
                    {product.description}
                  </p>
                
                  <div className="mt-2.5 flex gap-1.5 flex-wrap">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        FEATURED
                      </span>
                    )}
                  </div>
                
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">৳{product.price}</p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const productId = product._id || '';
                          if (isInCart(productId)) {
                            removeItem(productId);
                          } else {
                            const cartItem = {
                              productId,
                              name: product.name,
                              price: product.price,
                              image: product.images && product.images.length > 0 
                                ? product.images[0]
                                : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
                              seller: product.seller
                            };
                            addItem(cartItem);
                          }
                        }}
                        disabled={product.stock === 0}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm ${
                          isInCart(product._id || '') 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-md'
                        }`}
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const cartItem = {
                            productId: product._id || '',
                            name: product.name,
                            price: product.price,
                            image: product.images && product.images.length > 0 
                              ? product.images[0]
                              : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
                            seller: product.seller
                          };
                          addItem(cartItem);
                          navigate('/checkout');
                        }}
                        disabled={product.stock === 0}
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:from-blue-600 hover:to-indigo-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm hover:shadow-md"
                      >
                        <Zap className="w-3 h-3" />
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
