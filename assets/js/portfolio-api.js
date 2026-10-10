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

    const CACHE_PREFIX = 'portfolio_swr_cache_v2_';
    const DEFAULT_CACHE_TTL = 15 * 60 * 1000; // 15 Minutes TTL
    const _memoryCache = {};

    /** Client Storage Cache Engine (sessionStorage + localStorage) */
    const PortfolioCache = {
        get(key) {
            try {
                if (typeof window === 'undefined') return null;
                if (window.location.search.includes('nocache') || window.location.search.includes('refresh')) {
                    return null;
                }

                const storageKey = CACHE_PREFIX + key;
                let raw = null;
                try {
                    raw = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);
                } catch (e) {
                    raw = _memoryCache[storageKey];
                }

                if (!raw) return null;
                const entry = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (!entry || !entry.timestamp) return null;

                const age = Date.now() - entry.timestamp;
                if (age > (entry.ttl || DEFAULT_CACHE_TTL)) {
                    return null;
                }
                return entry.data;
            } catch (err) {
                return null;
            }
        },

        set(key, data, ttl = DEFAULT_CACHE_TTL) {
            try {
                const storageKey = CACHE_PREFIX + key;
                const payload = JSON.stringify({
                    timestamp: Date.now(),
                    ttl: ttl,
                    data: data
                });

                try {
                    sessionStorage.setItem(storageKey, payload);
                    localStorage.setItem(storageKey, payload);
                } catch (e) {
                    _memoryCache[storageKey] = payload;
                }
            } catch (err) {}
        },

        clear() {
            try {
                [sessionStorage, localStorage].forEach(storage => {
                    if (!storage) return;
                    Object.keys(storage).forEach(k => {
                        if (k.startsWith(CACHE_PREFIX)) {
                            storage.removeItem(k);
                        }
                    });
                });
            } catch (e) {}
            Object.keys(_memoryCache).forEach(k => delete _memoryCache[k]);
        }
    };

    const PortfolioApi = {
        baseUrl: API_BASE_URL,
        isLocalhost: isLocalhost,
        localApiUrl: 'http://localhost:5024/api',
        serverApiUrl: 'https://portfoliobackend-wisd.onrender.com/api',
        cache: PortfolioCache,
        _inFlightRevalidations: {},

        /** Generic fetch helper with SWR (Stale-While-Revalidate) & background prefetching */
        async request(endpoint, options = {}) {
            const isGet = !options.method || options.method.toUpperCase() === 'GET';
            const useSwr = isGet && options.swr !== false;

            // 1. Check Cache first: If cached, return immediately (0ms) and revalidate in background
            if (useSwr) {
                const cachedData = PortfolioCache.get(endpoint);
                if (cachedData !== null) {
                    this._revalidateInBackground(endpoint, options, cachedData);
                    return cachedData;
                }
            }

            // 2. No valid cache (or non-GET) -> execute actual network fetch
            const freshData = await this._executeFetch(endpoint, options);
            if (isGet && freshData !== undefined) {
                PortfolioCache.set(endpoint, freshData, options.ttl || DEFAULT_CACHE_TTL);
            }
            return freshData;
        },

        /** Internal network fetch execution */
        async _executeFetch(endpoint, options = {}) {
            const url = `${this.baseUrl}${endpoint}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), options.timeout || 35000);

            // Cold start notification timer (only for foreground requests)
            let coldStartTimer = null;
            let coldStartToast = null;

            if (typeof document !== 'undefined' && !options.background) {
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
                if (!options.background) {
                    console.warn(`[PortfolioApi] Request failed for ${endpoint}:`, err.message);
                }
                throw err;
            }
        },

        /** Revalidates endpoint in background and dispatches event if data changed */
        _revalidateInBackground(endpoint, options, oldData) {
            if (this._inFlightRevalidations[endpoint]) return;
            this._inFlightRevalidations[endpoint] = true;

            setTimeout(async () => {
                try {
                    const freshData = await this._executeFetch(endpoint, { ...options, background: true });
                    delete this._inFlightRevalidations[endpoint];

                    if (freshData !== undefined) {
                        const oldStr = JSON.stringify(oldData);
                        const newStr = JSON.stringify(freshData);

                        if (oldStr !== newStr) {
                            PortfolioCache.set(endpoint, freshData, options.ttl || DEFAULT_CACHE_TTL);
                            window.dispatchEvent(new CustomEvent('portfolio:data-updated', {
                                detail: { endpoint, data: freshData }
                            }));
                        } else {
                            PortfolioCache.set(endpoint, freshData, options.ttl || DEFAULT_CACHE_TTL);
                        }
                    }
                } catch (e) {
                    delete this._inFlightRevalidations[endpoint];
                }
            }, 300);
        },

        /** Idle background prefetcher for all primary site endpoints */
        prefetchAll(endpoints = ['/Navigation', '/Profile', '/Projects', '/Articles', '/Resume', '/Contact/info']) {
            const run = () => {
                endpoints.forEach((ep, idx) => {
                    setTimeout(() => {
                        if (PortfolioCache.get(ep) === null) {
                            this._executeFetch(ep, { background: true })
                                .then(data => {
                                    if (data !== undefined) {
                                        PortfolioCache.set(ep, data);
                                    }
                                })
                                .catch(() => {});
                        }
                    }, idx * 250);
                });
            };

            if (typeof window !== 'undefined') {
                if ('requestIdleCallback' in window) {
                    window.requestIdleCallback(run, { timeout: 3500 });
                } else {
                    setTimeout(run, 1200);
                }
            }
        },

        /** Clear cache manually */
        clearCache() {
            PortfolioCache.clear();
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
