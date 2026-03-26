import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aditya Puri
 *               email:
 *                 type: string
 *                 example: ady@gmail.com
 *               password:
 *                 type: string
 *                 example: ady-password
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Returns access and refresh tokens
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

router.post("/refresh", refreshToken);
router.post("/logout", protect, logoutUser);

export default router;
