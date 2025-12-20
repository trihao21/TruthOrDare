import express from 'express';
import {
    getAllQuestions,
    getQuestionsByCategory,
    addQuestion,
    deleteQuestion,
    seedDefaultQuestions
} from '../controllers/questionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Seed default questions (must be before /:category route)
router.post('/seed/default', seedDefaultQuestions);

// Public routes - anyone can view questions
router.get('/', getAllQuestions);
router.get('/:category', getQuestionsByCategory);

// Protected routes - must be authenticated
router.post('/', authenticate, addQuestion);

// Admin only routes
router.delete('/:id', authenticate, requireAdmin, deleteQuestion);

export default router;
