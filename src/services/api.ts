const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get access token from localStorage
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Get refresh token from localStorage
const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// Refresh access token
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        return data.data.accessToken;
      }

      // Refresh failed, clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// API request helper with auto token refresh
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  retryOn401 = true
): Promise<any> => {
  let token = getAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401 and retry enabled, try to refresh token
  if (response.status === 401 && retryOn401 && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Retry request with new token
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; phone: string; password: string }) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false); // Don't retry on 401 for auth endpoints
  },

  login: async (email: string, password: string) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false); // Don't retry on 401 for auth endpoints
  },

  refreshToken: async (refreshToken: string) => {
    return apiRequest('/users/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }, false); // Don't retry on 401 for refresh endpoint
  },

  logout: async () => {
    return apiRequest('/users/logout', {
      method: 'POST',
    }, false); // Don't retry on 401 for logout
  },

  getProfile: async () => {
    return apiRequest('/users/profile', {
      method: 'GET',
    });
  },

  updateProfile: async (profileData: { name?: string; bio?: string; location?: string; avatar?: string }) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Posts API
export const postsAPI = {
  getPosts: async (category?: string) => {
    const query = category && category !== 'All' ? `?category=${category}` : '';
    return apiRequest(`/posts${query}`, {
      method: 'GET',
    });
  },

  getPostById: async (id: string) => {
    return apiRequest(`/posts/${id}`, {
      method: 'GET',
    });
  },

  createPost: async (postData: { content: string; images?: string[]; videos?: string[]; category?: string; files?: File[] }) => {
    // If no files, use JSON (backward compatibility)
    if (!postData.files || postData.files.length === 0) {
      return apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: postData.content,
          images: postData.images,
          videos: postData.videos,
          category: postData.category,
        }),
      });
    }
    
    // Use FormData for file uploads
    const token = getAccessToken();
    const formData = new FormData();
    
    // Add text fields
    formData.append('content', postData.content || '');
    if (postData.category) {
      formData.append('category', postData.category);
    }
    
    // Add files
    postData.files.forEach(file => {
      formData.append('media', file);
    });
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type header - browser will set it with boundary for FormData
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers,
        body: formData,
      });

      // Parse response as text first to handle both JSON and non-JSON errors
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        // If response is not JSON, create error object
        throw new Error(text || 'Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      // Re-throw if it's already an Error, otherwise wrap it
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error or server unavailable');
    }
  },

  likePost: async (id: string) => {
    return apiRequest(`/posts/${id}/like`, {
      method: 'POST',
    });
  },

  commentPost: async (id: string, text: string) => {
    return apiRequest(`/posts/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};

// Shop API
export const shopAPI = {
  getProducts: async () => {
    return apiRequest('/shop', {
      method: 'GET',
    });
  },

  getProductById: async (id: string) => {
    return apiRequest(`/shop/${id}`, {
      method: 'GET',
    });
  },
};

// Groups API
export const groupsAPI = {
  getGroups: async () => {
    return apiRequest('/groups', {
      method: 'GET',
    });
  },

  getGroupById: async (id: string) => {
    return apiRequest(`/groups/${id}`, {
      method: 'GET',
    });
  },

  createGroup: async (groupData: { name: string; description: string; category?: string }) => {
    return apiRequest('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  },

  joinGroup: async (id: string) => {
    return apiRequest(`/groups/${id}/join`, {
      method: 'POST',
    });
  },

  leaveGroup: async (id: string) => {
    return apiRequest(`/groups/${id}/leave`, {
      method: 'POST',
    });
  },
};

// Library API
export const libraryAPI = {
  getResources: async () => {
    return apiRequest('/library', {
      method: 'GET',
    });
  },

  getResourceById: async (id: string) => {
    return apiRequest(`/library/${id}`, {
      method: 'GET',
    });
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async () => {
    return apiRequest('/notifications', {
      method: 'GET',
    });
  },

  markAsRead: async (id: string) => {
    return apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },
};

export default apiRequest;
