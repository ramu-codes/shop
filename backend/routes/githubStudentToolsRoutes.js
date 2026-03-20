import express from 'express';
import {
  getGitHubStudentTools,
  getCategories,
  getAccessInfo
} from '../controllers/githubStudentToolsController.js';

const router = express.Router();

// @route   GET /api/github-student-tools
// @desc    Get all GitHub Student Developer Pack tools (with optional filtering)
// @access  Public
router.get('/', getGitHubStudentTools);

// @route   GET /api/github-student-tools/categories
// @desc    Get all tool categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/github-student-tools/access-info
// @desc    Get information about accessing the GitHub Student Developer Pack
// @access  Public
router.get('/access-info', getAccessInfo);

export default router;
