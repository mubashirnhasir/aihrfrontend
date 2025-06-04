// Script to create a test employee in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Employee Schema (simplified)
const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  phone: String,
  department: String,
  designation: String,
  joiningDate: Date,
  role: String,
  status: { type: String, default: "active" },
  password: String,
  employeeId: { type: String, unique: true },
  isFirstLogin: { type: Boolean, default: true },
  lastLogin: Date,
});

const Employee = mongoose.model('Employee', employeeSchema);

async function createTestEmployee() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aihrms');
    console.log('Connected to MongoDB');

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test employee
    const testEmployee = new Employee({
      name: 'Test Employee',
      email: 'test@company.com',
      phone: '1234567890',
      department: 'IT',
      designation: 'Software Developer',
      joiningDate: new Date(),
      role: 'employee',
      status: 'active',
      password: hashedPassword,
      employeeId: 'EMP001',
      isFirstLogin: true, // This will redirect to onboarding after login
      lastLogin: null
    });

    await testEmployee.save();
    console.log('Test employee created successfully!');
    console.log('Login credentials:');
    console.log('Employee ID: EMP001');
    console.log('Password: password123');
    
  } catch (error) {
    if (error.code === 11000) {
      console.log('Test employee already exists! Use existing credentials:');
      console.log('Employee ID: EMP001');
      console.log('Password: password123');
    } else {
      console.error('Error creating test employee:', error);
    }
  } finally {
    mongoose.connection.close();
  }
}

createTestEmployee();
