import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router';
import { shopAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Star, X, Store, Tag, ShoppingCart, Zap, ChevronLeft } from 'lucide-react';

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

const ProductDetailsPage: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { state, addItem, removeItem } = useCart();
  const navigate = useNavigate();

  // Check if product is already in cart
  const isInCart = (productId: string) => {
    return state.items.some(item => item.productId === productId);
  };

  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    }
  }, [productId]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await shopAPI.getProductById(id);
      if (response.success) {
        setProduct(response.data.product);
        // Load related products after getting the main product
        loadRelatedProducts(response.data.product.category);
      } else {
        setError(response.message || 'Product not found');
      }
    } catch (error: any) {
      console.error('Failed to load product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (category: string) => {
    try {
      const response = await shopAPI.getProducts({ category });
      if (response.success) {
        // Filter out the current product and take first 4
        const filteredProducts = response.data.products
          ?.filter((p: Product) => p._id !== productId)
          .slice(0, 4) || [];
        setRelatedProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Failed to load related products:', error);
      setRelatedProducts([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist or has been removed.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden">
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
                }
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg shadow-md"
              />
            </div>
            
            {/* Stock Badge */}
            {product.stock === 0 ? (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl">
                <span className="px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-xl">OUT OF STOCK</span>
              </div>
            ) : product.stock < 10 && (
              <div className="absolute -top-3 -right-3">
                <span className="px-4 py-2 bg-orange-500 text-white font-bold rounded-full shadow-lg">
                  {product.stock} left
                </span>
              </div>
            )}
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="w-14 h-14 bg-white rounded-md overflow-hidden cursor-pointer border border-gray-200 hover:border-green-500 transition-all">
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            
            {/* Action Buttons Below Image */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
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
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  isInCart(product._id || '')
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                } ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : ''}`}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 
                  ? 'Out of Stock' 
                  : isInCart(product._id || '') 
                    ? 'Remove' 
                    : 'Add to Cart'}
              </button>
              
              <button
                onClick={() => {
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
                className="flex-1 py-2.5 text-sm font-medium rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-1.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Category and Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed">
              {product.description}
            </p>
            
            {/* Rating */}
            {product.reviewCount > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-base font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No reviews yet - Be the first to review!</p>
            )}
            
            {/* Price */}
            <div>
              <p className="text-3xl font-bold text-gray-900">৳{product.price}</p>
            </div>
            
            {/* Stock Status */}
            <div>
              {product.stock === 0 ? (
                <div className="flex items-center gap-1.5 text-red-600">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              ) : product.stock < 10 ? (
                <div className="flex items-center gap-1.5 text-orange-600">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Only {product.stock} left</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-green-600">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">In Stock ({product.stock})</span>
                </div>
              )}
            </div>
            

            
            {/* Seller Info */}
            {product.seller && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Sold by</p>
                    <p className="text-sm font-medium text-gray-900">{product.seller}</p>
                  </div>
                </div>
              </div>
            )}
            

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-800 mb-1.5">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Two Column Section: Why Choose Us + Related Products */}
      <div className="mt-12 pt-8 px-4 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Why Choose Our Products */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Our Products?</h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100 h-full">
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                    <p className="text-gray-600 text-sm mt-1">Get your plants delivered within 2-3 business days with our express shipping service.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Healthy Plants Guaranteed</h3>
                    <p className="text-gray-600 text-sm mt-1">We ensure all plants are healthy and come with detailed care instructions for your success.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                    <p className="text-gray-600 text-sm mt-1">Not satisfied? Return within 7 days for a full refund with our hassle-free return policy.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Support</h3>
                    <p className="text-gray-600 text-sm mt-1">24/7 customer support from gardening experts to help with any questions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Related Products */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <div 
                    key={relatedProduct._id}
                    onClick={() => {
                      if (relatedProduct._id) {
                        navigate(`/product/${relatedProduct._id}`);
                      }
                    }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    <div className="relative h-28 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                      <img
                        src={
                          relatedProduct.images && relatedProduct.images.length > 0
                            ? relatedProduct.images[0]
                            : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
                        }
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Stock Badge */}
                      {relatedProduct.stock === 0 ? (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="px-2 py-1 bg-red-500 text-white font-bold rounded text-xs">OUT OF STOCK</span>
                        </div>
                      ) : relatedProduct.stock < 10 && (
                        <div className="absolute top-2 right-2">
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-orange-500 text-white rounded-full shadow-sm">
                            {relatedProduct.stock} left
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2.5">
                      <h3 className="text-xs font-semibold text-gray-900 truncate mb-1">
                        {relatedProduct.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-[9px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                          {relatedProduct.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">৳{relatedProduct.price}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const cartItem = {
                              productId: relatedProduct._id || '',
                              name: relatedProduct.name,
                              price: relatedProduct.price,
                              image: relatedProduct.images && relatedProduct.images.length > 0 
                                ? relatedProduct.images[0]
                                : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
                              seller: relatedProduct.seller
                            };
                            addItem(cartItem);
                          }}
                          disabled={relatedProduct.stock === 0}
                          className="rounded bg-gradient-to-r from-green-500 to-emerald-600 px-1.5 py-1 text-[10px] font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500 text-sm">No related products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Full Width Customer Reviews Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            See what our happy customers are saying about their purchases
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm mb-3">
              "The plants arrived in perfect condition and are thriving! Great packaging and fast delivery."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-green-800 text-xs">SJ</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Verified Buyer</p>
              </div>
            </div>
          </div>
          
          {/* Review 2 */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              "Excellent customer service and quality plants. Will definitely order again!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-green-800 text-xs">MR</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Mike Roberts</p>
                <p className="text-xs text-gray-500">Verified Buyer</p>
              </div>
            </div>
          </div>
          
          {/* Review 3 */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm mb-3">
              "Amazing variety and the care instructions were very helpful for a beginner like me."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-green-800 text-xs">EP</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Emma Parker</p>
                <p className="text-xs text-gray-500">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Review Stats */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-green-700">4.8</p>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">1,247+</p>
              <p className="text-gray-600 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">99%</p>
              <p className="text-gray-600 text-sm">Repeat Buyers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;