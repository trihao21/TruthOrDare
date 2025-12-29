import { api } from './api.js';

export const authService = {
  // Auth state management
  currentUser: null,
  isLoading: false,
  
  // Initialize auth state
  async init() {
    if (!api.isAuthenticated()) {
      return false;
    }
    
    try {
      this.isLoading = true;
      const response = await api.getCurrentUser();
      this.currentUser = response.user;
      return true;
    } catch (error) {
      console.error('Auth init failed:', error);
      await api.logout();
      return false;
    } finally {
      this.isLoading = false;
    }
  },

  // Login
  async login(username, password) {
    try {
      this.isLoading = true;
      const response = await api.login(username, password);
      this.currentUser = response.user;
      // Verify token was saved
      const token = api.getToken();
      if (!token) {
        throw new Error('Token không được lưu sau khi đăng nhập');
      }
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Đăng nhập thất bại' };
    } finally {
      this.isLoading = false;
    }
  },

  // Register
  async register(userData) {
    try {
      this.isLoading = true;
      const response = await api.register(userData);
      this.currentUser = response.user;
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      this.isLoading = false;
    }
  },

  // Logout
  async logout() {
    try {
      await api.logout();
    } finally {
      this.currentUser = null;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return api.isAuthenticated() && this.currentUser;
  },

  // Check if user has admin role
  isAdmin() {
    return this.currentUser?.role === 'admin';
  },

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  },

  // Auth event listeners
  onAuthChange(callback) {
    window.addEventListener('auth:unauthorized', callback);
    return () => window.removeEventListener('auth:unauthorized', callback);
  }
};