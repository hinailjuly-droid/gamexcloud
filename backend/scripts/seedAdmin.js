#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault');
    console.log('✅ MongoDB connected');

    const email = process.env.ADMIN_DEFAULT_EMAIL || 'admin@pixelvault.com';
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'PixelVault2024!';

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`⚠️  Admin with email ${email} already exists`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await Admin.create({
      username: 'admin',
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      role: 'superadmin'
    });

    console.log(`✅ Admin created successfully:`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: superadmin`);
    console.log(`\n⚠️  IMPORTANT: Change the default password after first login!`);

  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
