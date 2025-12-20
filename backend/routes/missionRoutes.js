import express from 'express';
import {
  createMission,
  getMissions,
  getMissionById,
  submitMission,
  getMissionSubmissions,
  getUserSubmissions,
  notifyMissionUnlock
} from '../controllers/missionController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getMissions);
router.get('/:id', getMissionById);
router.get('/:missionId/submissions', getMissionSubmissions);
router.get('/user/:userId/submissions', getUserSubmissions);

// Protected routes (can add auth middleware later)
router.post('/', createMission);
router.post('/:missionId/submit', upload.single('image'), submitMission);
router.post('/notify-unlock', notifyMissionUnlock);

export default router;


