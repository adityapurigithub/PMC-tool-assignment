import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, createProject);

router
  .route("/:id")
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route("/:id/members").post(protect, addMember);

export default router;
