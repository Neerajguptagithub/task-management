const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { getMyTasks, updateTaskStatus } = require('../controllers/employeeController');

router.use(protect, restrictTo('employee'));

router.get('/tasks', getMyTasks);
router.patch(
  '/tasks/:id/status',
  validate([body('status').notEmpty().withMessage('Status is required')]),
  updateTaskStatus
);

module.exports = router;
