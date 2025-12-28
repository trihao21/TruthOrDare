import { api } from './api.js';
import { identityService } from './identityService.js';
import { utilService } from './utilService.js';

const IDENTITY_AUTH_KEY = 'identity_auth_token';
const IDENTITY_USER_KEY = 'identity_user';

export const authService = {
  // Auth state management
  currentUser: null,
  isLoading: false,
  
  // Initialize auth state - check both identity-based and API-based auth
  async init() {
    // Check identity-based auth first
    const identityUser = this.getIdentityUser();
    if (identityUser) {
      this.currentUser = identityUser;
      return true;
    }

    // Fallback to API-based auth
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

  // Login with identity (auto-login after drawing identity)
  loginWithIdentity(identity) {
    const token = `identity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: identity.id,
      username: `Player ${identity.colorName}`,
      displayName: `${identity.avatar} Player ${identity.colorName}`,
      role: 'player',
      identity: identity,
      authType: 'identity'
    };

    utilService.storage.set(IDENTITY_AUTH_KEY, token);
    utilService.storage.set(IDENTITY_USER_KEY, user);
    this.currentUser = user;
    
    return { success: true, user };
  },

  // Get identity-based user
  getIdentityUser() {
    try {
      const token = utilService.storage.get(IDENTITY_AUTH_KEY);
      if (!token) return null;
      
      const user = utilService.storage.get(IDENTITY_USER_KEY);
      if (!user) return null;

      // Verify identity still exists
      const myIdentity = identityService.getMyIdentity();
      if (!myIdentity || myIdentity.id !== user.identity?.id) {
        this.logout();
        return null;
      }

      // Update user with latest identity
      user.identity = myIdentity;
      this.currentUser = user;
      return user;
    } catch {
      return null;
    }
  },

  // Login
  async login(username, password) {
    try {
      this.isLoading = true;
      const response = await api.login(username, password);
      this.currentUser = response.user;
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
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
      // Clear identity-based auth
      utilService.storage.remove(IDENTITY_AUTH_KEY);
      utilService.storage.remove(IDENTITY_USER_KEY);
      this.currentUser = null;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    // Check identity-based auth first
    if (this.getIdentityUser()) {
      return true;
    }
    // Fallback to API-based auth
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