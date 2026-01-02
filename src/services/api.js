const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchMatches = async () => {
    try {
        const response = await fetch(`${API_URL}/matches`);
        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
};

export const createAlert = async (alertData) => {
    try {
        const response = await fetch(`${API_URL}/alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alertData),
        });
        if (!response.ok) {
            throw new Error('Failed to create alert');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating alert:', error);
        throw error;
    }
};
