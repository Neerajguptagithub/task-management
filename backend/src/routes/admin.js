const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createEmployeeValidation,
  createTaskValidation,
  updateTaskValidation,
} = require('../middleware/adminValidation');
const {
  getEmployees,
  createEmployee,
  deleteEmployee,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/adminController');

router.use(protect, restrictTo('admin'));

router.get('/stats', getDashboardStats);
router.route('/employees').get(getEmployees).post(validate(createEmployeeValidation), createEmployee);
router.delete('/employees/:id', deleteEmployee);
router.route('/tasks').get(getAllTasks).post(validate(createTaskValidation), createTask);
router.route('/tasks/:id').put(validate(updateTaskValidation), updateTask).delete(deleteTask);

module.exports = router;
