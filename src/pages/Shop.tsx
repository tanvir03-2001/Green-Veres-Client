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
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GreenVerse Shop</h1>
              <p className="text-sm text-gray-600">Everything for your garden</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:text-green-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Sort and Filter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'price' | 'rating')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold mb-2">No products found</p>
            {selectedCategory !== 'All' || searchQuery ? (
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">No shops have added products yet</p>
                <p className="text-xs text-gray-400">Be the first to create a shop and add products!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => {
                  if (product._id) {
                    navigate(`/product/${product._id}`);
                  }
                }}
                className="w-full rounded-xl bg-white shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                {/* Image section */}
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                  <button className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 backdrop-blur hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
                    }
                    alt={product.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                                  
                  {/* Stock Badge */}
                  {product.stock === 0 ? (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-500 text-white font-bold rounded-lg text-xs">OUT OF STOCK</span>
                    </div>
                  ) : product.stock < 10 && (
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full shadow-sm">
                        {product.stock} left
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Content section */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 min-h-[2rem]">
                    {product.description}
                  </p>
                
                  <div className="mt-2 flex gap-1 flex-wrap">
                    <span className="rounded border px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="rounded border px-1.5 py-0.5 text-[10px] font-medium text-green-600 border-green-300">
                        FEATURED
                      </span>
                    )}
                  </div>
                
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-base font-bold text-gray-900">৳{product.price}</p>
                    <div className="flex gap-1">
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
                        className={`rounded-lg px-2 py-1 text-xs font-semibold text-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 ${
                          isInCart(product._id || '') 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        }`}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {/* {isInCart(product._id || '') ? 'R' : 'A'} */}
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
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:from-blue-600 hover:to-indigo-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
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
