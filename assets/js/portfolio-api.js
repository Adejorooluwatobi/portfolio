/**
 * Portfolio API Client
 * Connects portfolio-main to ASP.NET Core REST API
 */

(function () {
    const API_BASE_URL = 'http://localhost:5024/api';

    const PortfolioApi = {
        baseUrl: API_BASE_URL,

        /** Generic fetch helper with timeout & error handling */
        async request(endpoint, options = {}) {
            const url = `${this.baseUrl}${endpoint}`;
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
                ...options
            };

            try {
                const response = await fetch(url, config);
                if (!response.ok) {
                    const errorText = await response.text().catch(() => '');
                    throw new Error(`API Error [${response.status}] ${response.statusText}: ${errorText}`);
                }
                return await response.json();
            } catch (err) {
                console.warn(`[PortfolioApi] Request failed for ${endpoint}:`, err.message);
                throw err;
            }
        },

        // --- Navigation & Brand ---
        async getNavigation() {
            return this.request('/Navigation');
        },

        // --- Profile & Hero ---
        async getProfile() {
            return this.request('/Profile');
        },

        async getHero() {
            try {
                return await this.request('/Profile/hero');
            } catch (e) {
                const p = await this.getProfile();
                return p?.hero || null;
            }
        },

        // --- Projects & Case Studies ---
        async getProjects() {
            return this.request('/Projects');
        },

        async getProjectByIdOrSlug(idOrSlug) {
            return this.request(`/Projects/${idOrSlug}`);
        },

        // --- Articles ---
        async getArticles() {
            return this.request('/Articles');
        },

        async getArticleBySlug(slug) {
            return this.request(`/Articles/${slug}`);
        },

        // --- Resume, Experience & Skills ---
        async getResume() {
            return this.request('/Resume');
        },

        // --- Contact & Inquiries ---
        async getContactInfo() {
            return this.request('/Contact/info');
        },

        async submitInquiry(data) {
            return this.request('/Contact', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
    };

    window.PortfolioApi = PortfolioApi;
})();
