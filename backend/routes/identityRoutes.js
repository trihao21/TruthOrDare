import express from 'express';
import {
  assignIdentity,
  getIdentitiesStatus,
  getCurrentIdentity,
  resetAllAssignments
} from '../controllers/identityController.js';

const router = express.Router();

// Public routes
router.post('/assign', assignIdentity);
router.get('/status', getIdentitiesStatus);
router.get('/current', getCurrentIdentity);

// Reset route (for testing - consider adding admin auth)
router.delete('/reset', resetAllAssignments);

export default router;






