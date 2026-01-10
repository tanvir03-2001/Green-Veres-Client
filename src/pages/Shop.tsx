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

  const staticProducts: Product[] = [
  {
    name: "অর্কিড প্ল্যান্ট সেট",
    price: "৳১,৮৫০",
    badge: "সেরা বিক্রি",
    description: "ঘরের বাতাস বিশুদ্ধ রাখার জন্য ৩টি রঙিন অর্কিড।",
    stock: "স্টকে আছে",
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "সাকুলেন্ট কালেকশন",
    price: "৳৯৫০",
    description: "কম যত্নে টেবিলের জন্য ৫টি সাকুলেন্ট প্ল্যান্ট।",
    stock: "স্টকে আছে",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "মাটি ও সার কিট",
    price: "৳৬৫০",
    badge: "নতুন",
    description: "জৈব কম্পোস্ট, নারিকেলের ছোবড়ার মাটি ও বাগানের সাপোর্ট।",
    stock: "স্টকে আছে",
    image: "https://images.unsplash.com/photo-1469536526925-9b5547cd5d68?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "হার্ব গার্ডেন সেট",
    price: "৳১,৪৫০",
    description: "বেসিল, পুদিনা, ধনেপাতা সহ ৬টি হার্ব প্ল্যান্ট ও পট।",
    stock: "সীমিত স্টক",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "ইনডোর এয়ার পিউরিফায়ার",
    price: "৳১,২৫০",
    description: "স্নেক প্ল্যান্ট, পিস লিলি ও মানি প্ল্যান্ট এক সেটে।",
    stock: "স্টকে আছে",
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "গার্ডেন টুল বেসিক কিট",
    price: "৳৮৫০",
    description: "কাঁচি, ট্রওয়েল, স্প্রে বোতল ও দস্তানা।",
    stock: "স্টকে আছে",
    image: "https://images.unsplash.com/photo-1458239920096-bcff2b001565?auto=format&fit=crop&w=800&q=80",
  },
];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">GreenVerse Store</p>
            <h1 className="text-2xl font-bold text-gray-900">আপনার বাগানের সবকিছু এক জায়গায়</h1>
            <p className="text-sm text-gray-600">প্ল্যান্ট, টুলস, মাটি ও যত্ন—সব কিছুই মিলবে একই জায়গায়।</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium">৭২ ঘন্টায় ডেলিভারি</span>
              <span className="px-3 py-1 rounded-full bg-gray-100 font-medium">রিটার্ন উইন্ডো ৭ দিন</span>
              <span className="px-3 py-1 rounded-full bg-gray-100 font-medium">নিরাপদ প্যাকেজিং</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-xs text-gray-500">নতুন আইটেম</p>
              <p className="text-xl font-semibold text-green-700">২৪+</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-xs text-gray-500">সন্তুষ্ট ক্রেতা</p>
              <p className="text-xl font-semibold text-green-700">৫.০★</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-xs text-gray-500">ডেলিভারি স্লট</p>
              <p className="text-xl font-semibold text-green-700">প্রতিদিন</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {["সব", "গাছপালা", "টুলস", "মাটি ও সার", "ইনডোর", "আউটডোর"].map((item) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                item === "সব"
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-green-200 hover:text-green-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">লোড হচ্ছে...</div>
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
                        <p className="text-sm text-gray-500">{typeof product.stock === 'number' ? (product.stock > 0 ? 'স্টকে আছে' : 'স্টক নেই') : product.stock}</p>
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-6">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-700">৳{product.price}</span>
                      <button className="px-4 py-2 text-sm font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                        কার্টে যোগ করুন
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
                        কার্টে যোগ করুন
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
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">কম্বো অফার</p>
            <h2 className="text-xl font-bold text-gray-900">কিচেন গার্ডেন স্টার্টার কিট</h2>
            <p className="text-sm text-gray-600">১০টি বীজ প্যাকেট + জৈব সার + স্প্রে বোতল + গাইডবুক।</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-green-700">৳১,১৫০</span>
            <button className="px-4 py-2 text-sm font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition-colors">
              আজই অর্ডার করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
