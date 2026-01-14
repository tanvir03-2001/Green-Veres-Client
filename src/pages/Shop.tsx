import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { shopAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router';
import { Search, Star, Package, Filter, X, Store, Tag, ShoppingCart, Zap } from 'lucide-react';

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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
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
                onClick={() => setSelectedProduct(product)}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100 cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.featured && (
                      <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full">
                        ⭐
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-semibold bg-white/80 text-green-700 rounded-full backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>

                  {/* Stock Badge */}
                  {product.stock === 0 ? (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg text-sm">OUT OF STOCK</span>
                    </div>
                  ) : product.stock < 10 && (
                    <div className="absolute top-12 right-2">
                      <span className="px-2 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full shadow-sm">
                        {product.stock} left
                      </span>
                    </div>
                  )}

                  {/* Favorite Heart Icon */}
                  <button className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                    <svg className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem">{product.description}</p>

                  {/* Rating & Seller */}
                  <div className="flex items-center justify-between">
                    {product.reviewCount > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-900">{product.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No reviews</span>
                    )}
                    {product.seller && (
                      <div className="flex items-center gap-0.5 text-xs text-gray-500">
                        <Store className="w-2.5 h-2.5" />
                        <span className="line-clamp-1">{product.seller}</span>
                      </div>
                    )}
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ৳{product.price}
                      </span>
                    </div>
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
                      className={`px-3 py-1.5 text-xs font-medium rounded text-white transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed ${
                        isInCart(product._id || '') 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      }`}
                    >
                      {isInCart(product._id || '') ? 'Remove from Cart' : 'Add to Cart'}
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
                      className="px-3 py-1.5 text-xs font-medium rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Image */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[16/9]">
                <img
                  src={
                    selectedProduct.images && selectedProduct.images.length > 0
                      ? selectedProduct.images[0]
                      : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
                  }
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {selectedProduct.featured && (
                  <span className="absolute top-4 left-4 px-4 py-2 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg">
                    ⭐ Featured Product
                  </span>
                )}
              </div>

              {/* Product Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-600" />
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      {selectedProduct.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h3>

                  {/* Rating */}
                  {selectedProduct.reviewCount > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-bold text-gray-900">{selectedProduct.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-600">({selectedProduct.reviewCount} reviews)</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No reviews yet - Be the first to review!</p>
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  {/* Seller Info */}
                  {selectedProduct.seller && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Store className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Sold by</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedProduct.seller}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Price Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                      ৳{selectedProduct.price}
                    </p>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {selectedProduct.stock === 0 ? (
                        <div className="flex items-center gap-2 text-red-600">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-semibold">Out of Stock</span>
                        </div>
                      ) : selectedProduct.stock < 10 ? (
                        <div className="flex items-center gap-2 text-orange-600">
                          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="font-semibold">Only {selectedProduct.stock} left in stock!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-semibold">In Stock ({selectedProduct.stock} available)</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const productId = selectedProduct._id || '';
                          if (isInCart(productId)) {
                            removeItem(productId);
                          } else {
                            const cartItem = {
                              productId,
                              name: selectedProduct.name,
                              price: selectedProduct.price,
                              image: selectedProduct.images && selectedProduct.images.length > 0 
                                ? selectedProduct.images[0]
                                : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
                              seller: selectedProduct.seller
                            };
                            addItem(cartItem);
                          }
                          setSelectedProduct(null);
                        }}
                        disabled={selectedProduct.stock === 0}
                        className={`flex-1 px-6 py-4 text-lg font-bold rounded-xl transition-all hover:scale-105 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg ${
                          isInCart(selectedProduct._id || '')
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                        }`}
                      >
                        {selectedProduct.stock === 0 
                          ? 'Out of Stock' 
                          : isInCart(selectedProduct._id || '') 
                            ? 'Remove from Cart' 
                            : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => {
                          const cartItem = {
                            productId: selectedProduct._id || '',
                            name: selectedProduct.name,
                            price: selectedProduct.price,
                            image: selectedProduct.images && selectedProduct.images.length > 0 
                              ? selectedProduct.images[0]
                              : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
                            seller: selectedProduct.seller
                          };
                          addItem(cartItem);
                          navigate('/checkout');
                        }}
                        disabled={selectedProduct.stock === 0}
                        className="flex-1 px-6 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        Buy Now
                      </button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
