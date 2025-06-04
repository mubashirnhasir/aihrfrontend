// Test script to verify employee profile API functionality
const BASE_URL = 'http://localhost:3000';

// Mock employee token (in real scenario this would come from authentication)
const MOCK_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';

async function testProfileAPI() {
    console.log('🧪 Testing Employee Profile API...\n');

    try {
        // Test 1: GET Profile (should work with mock backend)
        console.log('📥 Testing GET /api/employee/profile...');
        const getResponse = await fetch(`${BASE_URL}/api/employee/profile`, {
            headers: {
                'Authorization': MOCK_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Status: ${getResponse.status}`);
        if (getResponse.ok) {
            const profileData = await getResponse.json();
            console.log('✅ GET Profile successful');
            console.log('Profile structure:', Object.keys(profileData));
        } else {
            const error = await getResponse.text();
            console.log('❌ GET Profile failed:', error);
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: PUT Profile Update
        console.log('📤 Testing PUT /api/employee/profile...');
        const updateData = {
            personalInfo: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@company.com',
                phone: '+1-555-0123'
            },
            preferences: {
                language: 'en',
                theme: 'light',
                notifications: {
                    email: true,
                    sms: false
                }
            }
        };

        const putResponse = await fetch(`${BASE_URL}/api/employee/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': MOCK_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        console.log(`Status: ${putResponse.status}`);
        if (putResponse.ok) {
            const updatedData = await putResponse.json();
            console.log('✅ PUT Profile update successful');
            console.log('Response:', updatedData);
        } else {
            const error = await putResponse.text();
            console.log('❌ PUT Profile failed:', error);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testProfileAPI().then(() => {
    console.log('\n🏁 Profile API test completed');
});
