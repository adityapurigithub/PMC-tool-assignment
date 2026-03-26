import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getBoards, createBoard } from '../controllers/boardController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getBoards)
  .post(protect, createBoard);

export default router;
