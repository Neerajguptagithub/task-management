const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password, role: role || 'employee' });

  generateToken(user._id, res);

  res.status(201).json(new ApiResponse(201, { user }, 'Registration successful'));
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) throw new ApiError(403, 'Account deactivated. Contact admin.');

  generateToken(user._id, res);

  const userObj = user.toJSON();
  res.status(200).json(new ApiResponse(200, { user: userObj }, 'Login successful'));
};

const logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
};

const getMe = async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, 'Profile fetched'));
};

module.exports = { register, login, logout, getMe };
