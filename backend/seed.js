require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL });
  if (existing) {
    console.log('Admin already exists. Skipping seed.');
    process.exit(0);
  }

  await User.create({
    name: process.env.SEED_ADMIN_NAME,
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: 'admin',
  });

  console.log(`Admin seeded: ${process.env.SEED_ADMIN_EMAIL}`);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
