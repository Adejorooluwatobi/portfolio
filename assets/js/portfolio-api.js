/**
 * Portfolio API Client
 * Connects portfolio-main to ASP.NET Core REST API
 */

(function () {
    const isLocalhost = Boolean(
        typeof window !== 'undefined' && (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '[::1]'
        )
    );

    const API_BASE_URL = isLocalhost
        ? 'http://localhost:5024/api'
        : 'https://portfoliobackend-wisd.onrender.com/api';

    const PortfolioApi = {
        baseUrl: API_BASE_URL,
        isLocalhost: isLocalhost,
        localApiUrl: 'http://localhost:5024/api',
        serverApiUrl: 'https://portfoliobackend-wisd.onrender.com/api',

        /** Generic fetch helper with timeout & error handling */
        async request(endpoint, options = {}) {
            const url = `${this.baseUrl}${endpoint}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), options.timeout || 35000);

            // Cold start notification timer (shows helpful wake-up badge if backend spinup > 3.5s)
            let coldStartTimer = null;
            let coldStartToast = null;
            
            if (typeof document !== 'undefined') {
                coldStartTimer = setTimeout(() => {
                    coldStartToast = document.getElementById('api-cold-start-banner');
                    if (!coldStartToast) {
                        coldStartToast = document.createElement('div');
                        coldStartToast.id = 'api-cold-start-banner';
                        coldStartToast.className = 'fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-high/95 border border-primary/40 text-text-primary shadow-2xl backdrop-blur-xl transition-all duration-300 font-code-sm text-xs';
                        document.body.appendChild(coldStartToast);
                    }
                    coldStartToast.innerHTML = `
                        <span class="inline-block w-3.5 h-3.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                        <span class="text-text-primary">Connecting to cloud backend <span class="text-secondary">(waking up server)</span>...</span>
                    `;
                    coldStartToast.style.display = 'flex';
                }, 3500);
            }

            const config = {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
                ...options
            };

            try {
                const response = await fetch(url, config);
                clearTimeout(timeoutId);
                if (coldStartTimer) clearTimeout(coldStartTimer);
                if (coldStartToast) coldStartToast.style.display = 'none';

                if (!response.ok) {
                    const errorText = await response.text().catch(() => '');
                    throw new Error(`API Error [${response.status}] ${response.statusText}: ${errorText}`);
                }
                return await response.json();
            } catch (err) {
                clearTimeout(timeoutId);
                if (coldStartTimer) clearTimeout(coldStartTimer);
                if (coldStartToast) coldStartToast.style.display = 'none';
                console.warn(`[PortfolioApi] Request failed for ${endpoint}:`, err.message);
                throw err;
            }
        },

        /** Helper to format image URLs, ensuring backend /uploads/ paths are absolute */
        formatImageUrl(url) {
            if (!url) return '';
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
                return url;
            }
            if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
                const cleanHost = this.baseUrl.replace(/\/api\/?$/, '');
                const cleanPath = url.startsWith('/') ? url : `/${url}`;
                return `${cleanHost}${cleanPath}`;
            }
            return url;
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
