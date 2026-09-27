/**
 * API Client for Portfolio
 * Handles all dynamic data fetching from the .NET Backend
 */

const API_BASE_URL = 'https://localhost:7111/api';

const ApiClient = {
    /**
     * Fetch profile/about information
     */
    getProfile: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/profile`);
            if (!res.ok) throw new Error('Failed to fetch profile');
            return await res.json();
        } catch (error) {
            console.error('API Error (getProfile):', error);
            return null;
        }
    },

    /**
     * Fetch resume data (experience, education, skills)
     */
    getResume: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/resume`);
            if (!res.ok) throw new Error('Failed to fetch resume');
            return await res.json();
        } catch (error) {
            console.error('API Error (getResume):', error);
            return null;
        }
    },

    /**
     * Fetch all projects
     */
    getProjects: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/projects`);
            if (!res.ok) throw new Error('Failed to fetch projects');
            return await res.json();
        } catch (error) {
            console.error('API Error (getProjects):', error);
            return [];
        }
    },

    /**
     * Fetch all articles
     */
    getArticles: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/articles`);
            if (!res.ok) throw new Error('Failed to fetch articles');
            return await res.json();
        } catch (error) {
            console.error('API Error (getArticles):', error);
            return [];
        }
    },

    /**
     * Submit contact form inquiry
     */
    submitContact: async (contactData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
            if (!res.ok) throw new Error('Failed to submit contact');
            return true;
        } catch (error) {
            console.error('API Error (submitContact):', error);
            return false;
        }
    }
};

window.ApiClient = ApiClient;
