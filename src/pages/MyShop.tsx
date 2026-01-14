import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { sellerAPI, shopAPI } from '../services/api';
import { uploadToCloudinary } from '../services/uploadHelper';
import { Store, Plus, Edit, Trash2, Package, Star, TrendingUp, Upload, X, Heart } from 'lucide-react';

type Shop = {
  _id: string;
  shopName: string;
  description: string;
  logo?: string;
  banner?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  totalSales: number;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
};

const MyShopPage: FC = () => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    logo: '',
    banner: '',
    address: '',
    phone: '',
    email: '',
  });

  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Plants',
    images: [] as string[],
    tags: '',
  });

  useEffect(() => {
    loadShop();
  }, []);

  const loadShop = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getMySeller();
      if (response.success) {
        setShop(response.data.seller);
        loadProducts(response.data.seller._id);
      }
    } catch (error: any) {
      // If user doesn't have a shop, that's okay - show create form
      if (error.message.includes('do not have a shop')) {
        setShop(null);
      } else {
        console.error('Failed to load shop:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (sellerId: string) => {
    try {
      const response = await sellerAPI.getSellerProducts(sellerId);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sellerAPI.createSeller(formData);
      if (response.success) {
        setShop(response.data.seller);
        setShowCreateForm(false);
        setShowMediaUploadModal(true); // Show upload modal after creation
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create shop');
    }
  };

  const handleSkipMediaUpload = () => {
    setShowMediaUploadModal(false);
    setFormData({ ...formData, logo: '', banner: '' });
  };

  const handleSaveMedia = async () => {
    try {
      if (formData.logo || formData.banner) {
        await sellerAPI.updateSeller({
          logo: formData.logo,
          banner: formData.banner,
        });
      }
      setShowMediaUploadModal(false);
      loadShop(); // Reload shop data
    } catch (error: any) {
      alert(error.message || 'Failed to update shop');
    }
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'banner' | 'product') => {
    try {
      setUploading(true);
      setUploadProgress(`Uploading ${type}...`);
      const url = await uploadToCloudinary(file, 'image');
      
      if (type === 'logo') {
        setFormData({ ...formData, logo: url });
      } else if (type === 'banner') {
        setFormData({ ...formData, banner: url });
      } else if (type === 'product') {
        setProductFormData({ ...productFormData, images: [url] });
      }
      
      setUploadProgress('');
      setUploading(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}

Please check:
1. Cloudinary upload preset 'greenverse' exists
2. Upload preset is set to 'unsigned'
3. Internet connection is working`);
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sellerAPI.updateSeller(formData);
      if (response.success) {
        setShop(response.data.seller);
        setShowEditForm(false);
        alert('Shop updated successfully!');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update shop');
    }
  };

  const handleDeleteShop = async () => {
    if (!confirm('Are you sure? This will delete your shop and all products.')) return;
    try {
      await sellerAPI.deleteSeller();
      setShop(null);
      setProducts([]);
      alert('Shop deleted successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to delete shop');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productFormData.images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }
    
    try {
      const productData = {
        ...productFormData,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        tags: productFormData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      const response = await shopAPI.createProduct(productData);
      if (response.success) {
        loadProducts(shop!._id);
        setShowProductForm(false);
        resetProductForm();
        alert('Product created successfully!');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (productFormData.images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    try {
      const productData = {
        ...productFormData,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        tags: productFormData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      const response = await shopAPI.updateProduct(editingProduct._id, productData);
      if (response.success) {
        loadProducts(shop!._id);
        setShowProductForm(false);
        setEditingProduct(null);
        resetProductForm();
        alert('Product updated successfully!');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await shopAPI.deleteProduct(productId);
      loadProducts(shop!._id);
      alert('Product deleted successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to delete product');
    }
  };

  const openEditShop = () => {
    setFormData({
      shopName: shop?.shopName || '',
      description: shop?.description || '',
      logo: shop?.logo || '',
      banner: shop?.banner || '',
      address: shop?.address || '',
      phone: shop?.phone || '',
      email: shop?.email || '',
    });
    setShowEditForm(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      images: product.images.length > 0 ? product.images : [],
      tags: '',
    });
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Plants',
      images: [],
      tags: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Media upload modal after shop creation
  if (showMediaUploadModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop Created Successfully! 🎉</h2>
            <p className="text-gray-600">Would you like to add a logo and banner to your shop?</p>
          </div>

          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Shop Logo (Optional)</label>
              {formData.logo ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-green-500 mb-3">
                  <img src={formData.logo} alt="Logo" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logo: '' })}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 cursor-pointer transition-all hover:bg-green-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'logo');
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {uploading ? uploadProgress : 'Click to upload logo'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </label>
              )}
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Shop Banner (Optional)</label>
              {formData.banner ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-green-500 mb-3">
                  <img src={formData.banner} alt="Banner" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, banner: '' })}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 cursor-pointer transition-all hover:bg-green-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'banner');
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {uploading ? uploadProgress : 'Click to upload banner'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleSkipMediaUpload}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="button"
              onClick={handleSaveMedia}
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : (formData.logo || formData.banner) ? 'Save & Continue' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No shop created yet
  if (!shop && !showCreateForm) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Shop</h2>
          <p className="text-gray-600 mb-6">
            Create your own shop and start selling gardening products to the GreenVerse community!
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            Create My Shop
          </button>
        </div>
      </div>
    );
  }

  // Create shop form
  if (showCreateForm) {
    return (
      <div className="min-h-full bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Shop</h2>
          <p className="text-sm text-gray-600 mb-6">Start with basic information. You can add logo and banner after creating your shop.</p>
          <form onSubmit={handleCreateShop} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="My Green Shop"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell customers about your shop..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="123 Green Street, Dhaka"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+880 1234 567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="shop@email.com"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Create Shop
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Edit shop form (similar to create)
  if (showEditForm && shop) {
    return (
      <div className="min-h-full bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Shop Details</h2>
          <form onSubmit={handleUpdateShop} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner URL</label>
                <input
                  type="url"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Update Shop
              </button>
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Product form
  if (showProductForm) {
    return (
      <div className="min-h-full bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={productFormData.name}
                onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={productFormData.description}
                onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={productFormData.price}
                  onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={productFormData.stock}
                  onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={productFormData.category}
                onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Plants">Plants</option>
                <option value="Tools">Tools</option>
                <option value="Soil & Fertilizer">Soil & Fertilizer</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Seeds">Seeds</option>
                <option value="Pots">Pots</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
              {productFormData.images.length > 0 && (
                <div className="mb-3 relative">
                  <img 
                    src={productFormData.images[0]} 
                    alt="Product preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setProductFormData({ ...productFormData, images: [] })}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'product');
                  }}
                  className="hidden"
                  disabled={uploading}
                />
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {uploading ? uploadProgress : 'Upload Product Image'}
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={productFormData.tags}
                onChange={(e) => setProductFormData({ ...productFormData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="organic, indoor, bestseller"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Shop dashboard
  if (!shop) return null;

  return (
    <div className="min-h-full bg-gray-50">
      {/* Shop Banner */}
      {shop.banner && (
        <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-green-400 to-emerald-500 overflow-hidden">
          <img 
            src={shop.banner} 
            alt="Shop Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}
      
      {/* Shop Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {shop.logo && (
                <img src={shop.logo} alt={shop.shopName} className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{shop.shopName}</h1>
                <p className="text-sm text-gray-600">{shop.description}</p>
                {shop.address && <p className="text-xs text-gray-500 mt-1">{shop.address}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={openEditShop}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteShop}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Package className="w-4 h-4" />
                <span className="text-xs font-medium">Products</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{shop.totalProducts}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Sales</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{shop.totalSales}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-xs font-medium">Rating</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{shop.rating.toFixed(1)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-xs font-medium">Reviews</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{shop.reviewCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Products</h2>
          <button
            onClick={() => {
              resetProductForm();
              setShowProductForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No products yet</p>
            <p className="text-sm text-gray-400">Start adding products to your shop</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="w-full rounded-xl bg-white shadow-md overflow-hidden group">
                {/* Image section */}
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                  <button className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 backdrop-blur hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>

                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'}
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
                        onClick={() => openEditProduct(product)}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-colors"
                      >
                        Ed
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                      >
                        Del
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

export default MyShopPage;
