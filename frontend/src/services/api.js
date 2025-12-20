const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Token management
const TOKEN_KEY = 'truth_or_dare_token';

const tokenManager = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};

// HTTP client with auth headers
const httpClient = {
  async request(url, options = {}) {
    const token = tokenManager.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_URL}${url}`, config);
      
      // Handle auth errors
      if (response.status === 401) {
        tokenManager.removeToken();
        // Redirect to login or emit auth error event
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Phiên đăng nhập đã hết hạn');
      }
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Lỗi kết nối mạng' }));
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  },

  get(url) {
    return this.request(url);
  },

  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(url) {
    return this.request(url, {
      method: 'DELETE',
    });
  }
};

export const api = {
  // Authentication
  async login(username, password) {
    const response = await httpClient.post('/auth/login', { username, password });
    if (response.token) {
      tokenManager.setToken(response.token);
    }
    return response;
  },

  async register(userData) {
    const response = await httpClient.post('/auth/register', userData);
    if (response.token) {
      tokenManager.setToken(response.token);
    }
    return response;
  },

  async logout() {
    tokenManager.removeToken();
    // Optional: call backend logout endpoint
    try {
      await httpClient.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    }
  },

  async getCurrentUser() {
    return httpClient.get('/auth/me');
  },

  // Questions API (now with auth)
  async getAllQuestions() {
    return httpClient.get('/questions');
  },

  async getQuestionsByCategory(category) {
    return httpClient.get(`/questions/${category}`);
  },

  async addQuestion(category, content) {
    return httpClient.post('/questions', { category, content });
  },

  async deleteQuestion(id) {
    return httpClient.delete(`/questions/${id}`);
  },

  async seedQuestions() {
    return httpClient.post('/questions/seed/default');
  },

  // User management (admin only)
  async getUsers() {
    return httpClient.get('/users');
  },

  async deleteUser(id) {
    return httpClient.delete(`/users/${id}`);
  },

  // Utility methods
  isAuthenticated() {
    return tokenManager.isAuthenticated();
  },

  getToken() {
    return tokenManager.getToken();
  }
};
