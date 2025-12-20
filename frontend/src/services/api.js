const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  // Get all questions
  async getAllQuestions() {
    const response = await fetch(`${API_URL}/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  },

  // Get questions by category
  async getQuestionsByCategory(category) {
    const response = await fetch(`${API_URL}/questions/${category}`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  },

  // Add new question
  async addQuestion(category, content) {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, content }),
    });
    if (!response.ok) throw new Error('Failed to add question');
    return response.json();
  },

  // Delete question
  async deleteQuestion(id) {
    const response = await fetch(`${API_URL}/questions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete question');
    }
    return response.json();
  },

  // Seed default questions
  async seedQuestions() {
    const response = await fetch(`${API_URL}/seed`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to seed questions');
    return response.json();
  }
};
