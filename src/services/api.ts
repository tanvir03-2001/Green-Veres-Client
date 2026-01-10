const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

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
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
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
    const token = getToken();
    const formData = new FormData();
    
    // Add text fields
    formData.append('content', postData.content);
    if (postData.category) {
      formData.append('category', postData.category);
    }
    
    // Add files if present
    if (postData.files && postData.files.length > 0) {
      postData.files.forEach(file => {
        formData.append('media', file);
      });
    }
    
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
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type header - browser will set it with boundary for FormData
    
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
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
