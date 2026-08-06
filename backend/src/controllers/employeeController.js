const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getMyTasks = async (req, res) => {
  const { status, priority } = req.query;
  const filter = { assignedTo: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter)
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { tasks }, 'Tasks fetched'));
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  if (!['todo', 'in_progress', 'completed'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found or not assigned to you');

  task.status = status;
  await task.save();

  res.status(200).json(new ApiResponse(200, { task }, 'Task status updated'));
};

module.exports = { getMyTasks, updateTaskStatus };
