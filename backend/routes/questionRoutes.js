import express from 'express';
import {
    getAllQuestions,
    getQuestionsByCategory,
    getUserQuestions,
    addQuestion,
    deleteQuestion,
    seedDefaultQuestions,
    getRandomQuestion,
    markAsDrawn,
    getQuestionCounts
} from '../controllers/questionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Seed default questions (must be before /:category route)
router.post('/seed/default', seedDefaultQuestions);

// Random question endpoint (must be before /:category route to avoid conflict)
router.post('/random', getRandomQuestion);

// Get question counts (must be before /:category route)
router.get('/counts', getQuestionCounts);

// Mark question as drawn (must be before /:category route)
router.patch('/:id/drawn', markAsDrawn);

// Public routes - anyone can view questions
router.get('/', getAllQuestions);
router.get('/user/:userId', getUserQuestions);
router.get('/:category', getQuestionsByCategory);

// Protected routes - must be authenticated
router.post('/', authenticate, addQuestion);

// Admin only routes
router.delete('/:id', authenticate, requireAdmin, deleteQuestion);

export default router;
