import express from 'express';
import { exportAllData } from '../controllers/activityController.js';

const router = express.Router();

router.get('/export', exportAllData);

export default router;
