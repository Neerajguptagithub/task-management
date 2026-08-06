const { body } = require('express-validator');

const createEmployeeValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
  body('assignedTo').notEmpty().withMessage('Assigned employee is required').isMongoId().withMessage('Invalid employee ID'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
];

const updateTaskValidation = [
  body('title').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('assignedTo').optional().isMongoId().withMessage('Invalid employee ID'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  body('dueDate').optional({ nullable: true }).isISO8601(),
];

module.exports = { createEmployeeValidation, createTaskValidation, updateTaskValidation };
