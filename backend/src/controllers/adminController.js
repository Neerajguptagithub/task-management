const User = require('../models/User');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getEmployees = async (req, res) => {
  const employees = await User.find({ role: 'employee' }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { employees }, 'Employees fetched'));
};

const createEmployee = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const employee = await User.create({ name, email, password, role: 'employee' });
  res.status(201).json(new ApiResponse(201, { employee }, 'Employee created'));
};

const deleteEmployee = async (req, res) => {
  const employee = await User.findById(req.params.id);
  if (!employee) throw new ApiError(404, 'Employee not found');
  if (employee.role === 'admin') throw new ApiError(403, 'Cannot delete an admin account');

  await Task.deleteMany({ assignedTo: employee._id });
  await employee.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Employee and their tasks deleted'));
};

const getAllTasks = async (req, res) => {
  const { status, priority, assignedTo } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { tasks }, 'Tasks fetched'));
};

const createTask = async (req, res) => {
  const { title, description, assignedTo, priority, status, dueDate } = req.body;

  const employee = await User.findById(assignedTo);
  if (!employee || employee.role !== 'employee') {
    throw new ApiError(400, 'Assigned user must be a valid employee');
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: req.user._id,
    priority,
    status,
    dueDate: dueDate || null,
  });

  const populated = await task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'assignedBy', select: 'name email' },
  ]);

  res.status(201).json(new ApiResponse(201, { task: populated }, 'Task created'));
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  const { assignedTo, ...rest } = req.body;

  if (assignedTo) {
    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== 'employee') {
      throw new ApiError(400, 'Assigned user must be a valid employee');
    }
    task.assignedTo = assignedTo;
  }

  Object.assign(task, rest);
  await task.save();

  const populated = await task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'assignedBy', select: 'name email' },
  ]);

  res.status(200).json(new ApiResponse(200, { task: populated }, 'Task updated'));
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  await task.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Task deleted'));
};

const getDashboardStats = async (req, res) => {
  const [
    totalEmployees,
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    recentTasks,
  ] = await Promise.all([
    User.countDocuments({ role: 'employee' }),
    Task.countDocuments(),
    Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Task.find()
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const statusMap = tasksByStatus.reduce((acc, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});

  const priorityMap = tasksByPriority.reduce((acc, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});

  res.status(200).json(
    new ApiResponse(200, {
      totalEmployees,
      totalTasks,
      tasksByStatus: {
        todo: statusMap.todo || 0,
        in_progress: statusMap.in_progress || 0,
        completed: statusMap.completed || 0,
      },
      tasksByPriority: {
        low: priorityMap.low || 0,
        medium: priorityMap.medium || 0,
        high: priorityMap.high || 0,
      },
      recentTasks,
    }, 'Dashboard stats fetched')
  );
};

module.exports = {
  getEmployees,
  createEmployee,
  deleteEmployee,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
};
