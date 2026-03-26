import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment
} from '../controllers/taskController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:taskId')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.post('/:taskId/comments', protect, addComment);

export default router;
