// Utility functions for the application
export const utilService = {
  // Format error messages for display
  formatError(error) {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'Đã xảy ra lỗi không xác định';
  },

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate username format
  isValidUsername(username) {
    // Username should be 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  // Validate password strength
  validatePassword(password) {
    const errors = [];
    
    if (!password) {
      errors.push('Mật khẩu không được để trống');
      return { isValid: false, errors };
    }
    
    if (password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    if (password.length > 100) {
      errors.push('Mật khẩu không được vượt quá 100 ký tự');
    }
    
    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất một chữ cái');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất một chữ số');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: this.getPasswordStrength(password)
    };
  },

  // Get password strength level
  getPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  },

  // Debounce function for search/input
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Format date for display
  formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Generate random ID
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },

  // Copy text to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return { success: true };
      } catch (fallbackError) {
        return { success: false, error: 'Không thể sao chép vào clipboard' };
      }
    }
  },

  // Local storage helpers with error handling
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    }
  },

  // Theme management
  theme: {
    get() {
      return utilService.storage.get('theme', 'light');
    },

    set(theme) {
      utilService.storage.set('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    },

    toggle() {
      const current = this.get();
      const newTheme = current === 'light' ? 'dark' : 'light';
      this.set(newTheme);
      return newTheme;
    },

    init() {
      const theme = this.get();
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  // Network status
  network: {
    isOnline() {
      return navigator.onLine;
    },

    onStatusChange(callback) {
      window.addEventListener('online', () => callback(true));
      window.addEventListener('offline', () => callback(false));
      
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    }
  }
};