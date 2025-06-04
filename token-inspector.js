// Token inspection utility
// Run this in browser console after successful login

function inspectEmployeeToken() {
  const token = localStorage.getItem('employeeToken');
  
  if (!token) {
    console.log('❌ No employee token found in localStorage');
    return;
  }
  
  console.log('🔍 Employee Token Analysis:');
  console.log('Raw token:', token);
  
  try {
    // Decode JWT (Note: This doesn't verify signature, just decodes)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    console.log('\n📋 Token Payload:');
    console.log('Employee ID:', payload.employeeId);
    console.log('Database ID:', payload.id);
    console.log('Role:', payload.role);
    console.log('First Login:', payload.isFirstLogin);
    console.log('Issued At:', new Date(payload.iat * 1000));
    console.log('Expires At:', new Date(payload.exp * 1000));
    console.log('Time until expiry:', Math.round((payload.exp * 1000 - Date.now()) / 1000 / 60), 'minutes');
    
    const employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
    console.log('\n👤 Employee Data:');
    console.log('Name:', employeeData.name);
    console.log('Email:', employeeData.email);
    console.log('Department:', employeeData.department);
    console.log('Designation:', employeeData.designation);
    
  } catch (error) {
    console.log('❌ Error decoding token:', error);
  }
}

// Run the inspection
inspectEmployeeToken();

// Also provide helper to clear tokens
window.clearEmployeeAuth = function() {
  localStorage.removeItem('employeeToken');
  localStorage.removeItem('employeeData');
  console.log('🧹 Employee authentication data cleared');
};
