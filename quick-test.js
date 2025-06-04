const axios = require('axios');

async function quickTest() {
    console.log('🧪 Quick Profile and Clock Test');
    console.log('=' .repeat(40));
    
    try {
        // Test with EMP001
        console.log('🔐 Testing with EMP001...');
        const signinResponse = await axios.post('http://localhost:5000/api/auth/signin', {
            employeeId: 'EMP001',
            password: 'password123'
        });
        
        const token = signinResponse.data.token;
        console.log('✅ EMP001 signed in successfully');
        
        // Test profile
        console.log('👤 Testing profile fetch...');
        const profileResponse = await axios.get('http://localhost:5000/api/employee/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Profile fetch successful');
        console.log('Profile structure:', Object.keys(profileResponse.data));
        
        // Check attendance status
        console.log('⏰ Checking attendance status...');
        const attendanceResponse = await axios.get('http://localhost:5000/api/employee/attendance/today', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('Attendance today:', attendanceResponse.data);
        
    } catch (error) {
        console.log('❌ Error:', error.response?.data?.message || error.message);
    }
}

quickTest();
