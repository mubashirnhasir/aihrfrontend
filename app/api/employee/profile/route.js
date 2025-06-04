import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header required' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/api/employee/profile`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || 'Failed to fetch profile' },
                { status: response.status }
            );
        }

        const profileData = await response.json();
        return NextResponse.json(profileData);

    } catch (error) {
        console.error('Profile GET API Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header required' }, { status: 401 });
        }

        const body = await request.json();

        // Validate that at least one section is provided
        const validSections = ['personalInfo', 'contactInfo', 'emergencyContact', 'bankDetails', 'preferences'];
        const providedSections = Object.keys(body);
        const validUpdate = providedSections.some(section => validSections.includes(section));

        if (!validUpdate) {
            return NextResponse.json(
                { message: 'At least one valid profile section must be provided' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/api/employee/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || 'Failed to update profile' },
                { status: response.status }
            );
        }

        const updatedData = await response.json();
        return NextResponse.json(updatedData);

    } catch (error) {
        console.error('Profile PUT API Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
