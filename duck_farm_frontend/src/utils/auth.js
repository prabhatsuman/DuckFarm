// src/utils/auth.js

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            // Optionally update refresh token if provided by the server
            if (data.refresh) {
                localStorage.setItem('refreshToken', data.refresh);
            }
        } else {
            console.error('Failed to refresh token:', response.status, response.statusText);
            // Optionally, handle the failure (e.g., redirect to login)
        }
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        // Optionally, handle the error (e.g., retry logic, redirect to login)
    }
};
