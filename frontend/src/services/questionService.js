import { api } from './api.js';

export const questionService = {
  // Cache for questions
  questionsCache: {
    all: null,
    truth: null,
    dare: null,
    lastFetch: null
  },

  // Cache duration (5 minutes)
  CACHE_DURATION: 5 * 60 * 1000,

  // Check if cache is valid
  isCacheValid() {
    return this.questionsCache.lastFetch && 
           (Date.now() - this.questionsCache.lastFetch) < this.CACHE_DURATION;
  },

  // Clear cache
  clearCache() {
    this.questionsCache = {
      all: null,
      truth: null,
      dare: null,
      lastFetch: null
    };
  },

  // Get all questions with caching
  async getAllQuestions(useCache = true) {
    if (useCache && this.isCacheValid() && this.questionsCache.all) {
      return this.questionsCache.all;
    }

    try {
      const response = await api.getAllQuestions();
      this.questionsCache.all = response.questions || response;
      this.questionsCache.lastFetch = Date.now();
      return this.questionsCache.all;
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      // Return cached data if available, even if expired
      return this.questionsCache.all || [];
    }
  },

  // Get questions by category with caching
  async getQuestionsByCategory(category, useCache = true) {
    const cacheKey = category.toLowerCase();
    
    if (useCache && this.isCacheValid() && this.questionsCache[cacheKey]) {
      return this.questionsCache[cacheKey];
    }

    try {
      const response = await api.getQuestionsByCategory(category);
      this.questionsCache[cacheKey] = response.questions || response;
      this.questionsCache.lastFetch = Date.now();
      return this.questionsCache[cacheKey];
    } catch (error) {
      console.error(`Failed to fetch ${category} questions:`, error);
      // Return cached data if available, even if expired
      return this.questionsCache[cacheKey] || [];
    }
  },

  // Add new question (requires authentication)
  async addQuestion(category, content) {
    try {
      const response = await api.addQuestion(category, content);
      // Clear cache to force refresh
      this.clearCache();
      return { success: true, question: response.question };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete question (requires authentication)
  async deleteQuestion(id) {
    try {
      await api.deleteQuestion(id);
      // Clear cache to force refresh
      this.clearCache();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Seed default questions
  async seedDefaultQuestions() {
    try {
      const response = await api.seedQuestions();
      // Clear cache to force refresh
      this.clearCache();
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get random question from category
  async getRandomQuestion(category) {
    try {
      const questions = await this.getQuestionsByCategory(category);
      if (!questions || questions.length === 0) {
        return { content: `Không có câu hỏi ${category} nào!` };
      }
      return questions[Math.floor(Math.random() * questions.length)];
    } catch (error) {
      console.error(`Failed to get random ${category} question:`, error);
      return { content: 'Có lỗi xảy ra khi lấy câu hỏi!' };
    }
  },

  // Validate question content
  validateQuestion(content, category) {
    const errors = [];

    if (!content || content.trim().length === 0) {
      errors.push('Nội dung câu hỏi không được để trống');
    } else {
      const trimmedContent = content.trim();
      
      if (trimmedContent.length < 10) {
        errors.push(`Câu hỏi phải có ít nhất 10 ký tự (hiện tại: ${trimmedContent.length})`);
      }

      if (trimmedContent.length > 500) {
        errors.push(`Câu hỏi không được vượt quá 500 ký tự (hiện tại: ${trimmedContent.length})`);
      }

      // Check for meaningful content (not just repeated characters)
      if (trimmedContent.length >= 3) {
        const uniqueChars = new Set(trimmedContent.toLowerCase().replace(/\s/g, '')).size;
        if (uniqueChars < 3) {
          errors.push('Câu hỏi cần có nội dung có ý nghĩa, không chỉ lặp lại ký tự');
        }
      }
    }

    if (!category || !['truth', 'dare'].includes(category.toLowerCase())) {
      errors.push('Danh mục phải là Truth hoặc Dare');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get question statistics
  async getQuestionStats() {
    try {
      const allQuestions = await this.getAllQuestions();
      const truthQuestions = allQuestions.filter(q => q.category.toLowerCase() === 'truth');
      const dareQuestions = allQuestions.filter(q => q.category.toLowerCase() === 'dare');

      return {
        total: allQuestions.length,
        truth: truthQuestions.length,
        dare: dareQuestions.length
      };
    } catch (error) {
      console.error('Failed to get question stats:', error);
      return { total: 0, truth: 0, dare: 0 };
    }
  }
};