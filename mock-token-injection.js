// Quick token injection script for testing
// Run this in browser console on any page of your app

// This creates a mock token for testing (expires in 8 hours)
const mockEmployeeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzY4YWVkMzIxZjIzNDU2Nzg5YWJjZCIsImVtcGxveWVlSWQiOiJFTVAwMDEiLCJyb2xlIjoiZW1wbG95ZWUiLCJpc0ZpcnN0TG9naW4iOnRydWUsImlhdCI6MTczNTk4NzIwMCwiZXhwIjoxNzM2MDE2MDAwfQ.example';

// Store token in localStorage
localStorage.setItem('employeeToken', mockEmployeeToken);

// Store mock employee data
const mockEmployeeData = {
  id: '67768aed321f23456789abcd',
  name: 'Test Employee',
  email: 'test@company.com',
  employeeId: 'EMP001',
  designation: 'Software Developer',
  department: 'IT',
  isFirstLogin: true
};
localStorage.setItem('employeeData', JSON.stringify(mockEmployeeData));

console.log('✅ Mock token and employee data set!');
console.log('Now navigate to: /employee/onboarding');

// NOTE: This is for testing only. The token might not work with actual API calls
// since it's not signed with your JWT_SECRET. Use Method 1 for real testing.
