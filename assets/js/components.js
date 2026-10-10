/**
 * Centralized Component Loader
 * Loads single header.html and footer.html across all pages
 * Supports HTTP/HTTPS fetch and zero-CORS file:// inline fallback
 */

(function() {
    const HEADER_TEMPLATE = `<!-- Top Persistent Navigation Bar -->
<header class="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-border-subtle">
    <div class="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
        
        <!-- Brand & Availability -->
        <div class="flex items-center gap-4">
            <a class="group flex items-center gap-3" href="index.html">
                <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center transition-colors group-hover:bg-primary-container border border-border-subtle">
                    <span class="font-code-md text-primary font-bold group-hover:text-on-primary-container">OA</span>
                </div>
                <div class="flex flex-col">
                    <span id="header-brand-name" class="font-headline-sm text-text-primary leading-tight font-semibold">Oluwatobi Adejoro</span>
                    <span id="header-primary-title" class="font-code-sm text-text-muted leading-tight">Software Engineer</span>
                </div>
            </a>
            <div class="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-border-subtle">
                <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span class="font-label-badge text-[11px] text-secondary tracking-wide">Available for opportunities</span>
            </div>
        </div>

        <!-- Multi-Page Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1 bg-surface-container-low/80 p-1.5 rounded-xl border border-border-subtle" id="nav-links">
            <a class="nav-item px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium" data-page="index.html" href="index.html">About</a>
            <a class="nav-item px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium" data-page="resume.html" href="resume.html">Resume & Skills</a>
            <a class="nav-item px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium" data-page="portfolio.html" href="portfolio.html">Featured Works</a>
            <a class="nav-item px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium" data-page="articles.html" href="articles.html">Articles</a>
            <a class="nav-item px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium" data-page="contact.html" href="contact.html">Contact</a>
        </nav>

        <!-- Actions: Socials, CV Download, Theme Toggle, Mobile Menu Button -->
        <div class="flex items-center gap-3">
            <button type="button" class="theme-toggle-btn w-9 h-9 rounded-lg bg-surface-container-high/70 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors border border-border-subtle" title="Toggle Light / Dark Mode" aria-label="Toggle Light / Dark Mode">
                <span class="material-symbols-outlined theme-icon text-[20px]">light_mode</span>
            </button>
            <a class="w-9 h-9 rounded-lg bg-surface-container-high/70 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors border border-border-subtle" href="https://github.com" rel="noopener noreferrer" target="_blank" title="GitHub">
                <span class="material-symbols-outlined text-[20px]">code</span>
            </a>
            <a class="w-9 h-9 rounded-lg bg-surface-container-high/70 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors border border-border-subtle" href="https://www.linkedin.com/in/adejoro-oluwatobi-6009411b5/" rel="noopener noreferrer" target="_blank" title="LinkedIn">
                <span class="material-symbols-outlined text-[20px]">share</span>
            </a>
            <a class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-sm font-semibold hover:bg-primary hover:text-surface transition-all shadow-md download-cv-btn" href="#" data-cv-download="true" title="Download Verified Fullstack CV">
                <span class="material-symbols-outlined text-[18px]">download</span>
                <span>Download CV</span>
            </a>
            <button id="mobile-menu-toggle" type="button" class="lg:hidden w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-text-primary hover:bg-surface-container-highest transition-colors border border-border-subtle" aria-label="Toggle Navigation Menu">
                <span class="material-symbols-outlined text-[24px]">menu</span>
            </button>
        </div>

    </div>
</header>

<!-- Mobile Drawer Overlay & Menu -->
<div id="mobile-menu-backdrop" class="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300"></div>
<div id="mobile-menu-drawer" class="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-surface-container-low border-l border-border-subtle z-50 p-6 flex flex-col justify-between transform translate-x-full transition-transform duration-300 shadow-2xl">
    <div>
        <div class="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-bold font-code-md">OA</div>
                <span class="font-headline-sm text-text-primary font-semibold">Menu</span>
            </div>
            <button id="mobile-menu-close" type="button" class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-text-muted hover:text-text-primary">
                <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
        </div>
        <nav class="flex flex-col gap-2" id="mobile-nav-links">
            <a class="mobile-nav-item px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors text-sm font-medium flex items-center justify-between" data-page="index.html" href="index.html">
                <span>About Overview</span>
                <span class="material-symbols-outlined text-[18px]">person</span>
            </a>
            <a class="mobile-nav-item px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors text-sm font-medium flex items-center justify-between" data-page="resume.html" href="resume.html">
                <span>Resume & Skills</span>
                <span class="material-symbols-outlined text-[18px]">description</span>
            </a>
            <a class="mobile-nav-item px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors text-sm font-medium flex items-center justify-between" data-page="portfolio.html" href="portfolio.html">
                <span>Featured Works</span>
                <span class="material-symbols-outlined text-[18px]">layers</span>
            </a>
            <a class="mobile-nav-item px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors text-sm font-medium flex items-center justify-between" data-page="articles.html" href="articles.html">
                <span>Articles & Insights</span>
                <span class="material-symbols-outlined text-[18px]">edit_note</span>
            </a>
            <a class="mobile-nav-item px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors text-sm font-medium flex items-center justify-between" data-page="contact.html" href="contact.html">
                <span>Contact Inquiries</span>
                <span class="material-symbols-outlined text-[18px]">mail</span>
            </a>
        </nav>
    </div>
    <div class="pt-6 border-t border-border-subtle space-y-3">
        <button type="button" class="theme-toggle-btn w-full py-2.5 px-4 rounded-lg bg-surface-container-high text-text-primary font-body-sm text-sm flex items-center justify-between border border-border-subtle">
            <span class="flex items-center gap-2">
                <span class="material-symbols-outlined theme-icon text-[18px]">light_mode</span>
                <span>Switch Theme Mode</span>
            </span>
            <span class="font-code-sm text-xs text-text-muted">Light / Dark</span>
        </button>
        <a class="w-full py-2.5 px-4 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary hover:text-surface transition-all shadow-md download-cv-btn" href="#" data-cv-download="true">
            <span class="material-symbols-outlined text-[18px]">download</span>
            <span>Download CV</span>
        </a>
        <button onclick="copyEmailToClipboard('Adejorotgold1@yahoo.com')" class="w-full py-2 px-4 rounded-lg bg-surface-container-high text-text-secondary hover:text-text-primary font-code-sm text-xs flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy Email Address</span>
        </button>
    </div>
</div>`;

    const FOOTER_TEMPLATE = `<!-- Universal Persistent Footer -->
<footer class="w-full bg-surface-container-lowest/90 backdrop-blur-xl border-t border-border-subtle mt-auto py-8">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex flex-col items-center md:items-start gap-1">
            <div class="flex items-center gap-2">
                <span class="font-code-md text-primary font-bold">OA</span>
                <span class="text-text-muted text-xs">•</span>
                <span class="text-on-surface text-xs font-medium">© 2025 Oluwatobi Adejoro. All rights reserved.</span>
            </div>
            <p class="font-code-sm text-xs text-text-muted">Engineered with modern web standards, strict typing & high performance.</p>
        </div>
        <div class="flex items-center gap-3">
            <a class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-code-sm text-xs border border-border-subtle" href="https://github.com" rel="noopener noreferrer" target="_blank">
                <span class="material-symbols-outlined text-[16px]">terminal</span>
                <span>GitHub</span>
            </a>
            <a class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-code-sm text-xs border border-border-subtle" href="https://www.linkedin.com/in/adejoro-oluwatobi-6009411b5/" rel="noopener noreferrer" target="_blank">
                <span class="material-symbols-outlined text-[16px]">share</span>
                <span>LinkedIn</span>
            </a>
            <a class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-code-sm text-xs border border-border-subtle" href="https://x.com/tgold_adejoro" rel="noopener noreferrer" target="_blank">
                <span class="font-code-sm text-xs font-bold">𝕏</span>
                <span>Twitter</span>
            </a>
            <button onclick="copyEmailToClipboard('Adejorotgold1@yahoo.com')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-code-sm text-xs border border-border-subtle">
                <span class="material-symbols-outlined text-[16px]">content_copy</span>
                <span>Adejorotgold1@yahoo.com</span>
            </button>
        </div>
    </div>
</footer>`;

    async function loadComponent(elementId, externalFile, inlineFallback) {
        const container = document.getElementById(elementId);
        if (!container) return;

        // Try fetch if served via HTTP/HTTPS
        if (window.location.protocol.startsWith('http')) {
            try {
                const res = await fetch(externalFile);
                if (res.ok) {
                    container.innerHTML = await res.text();
                    return;
                }
            } catch (e) {
                // Network or CORS issue; fallback to inline template
            }
        }

        // Instant fallback for local file:// protocol
        container.innerHTML = inlineFallback;
    }

    function setActiveNavigation() {
        const currentPath = window.location.pathname.toLowerCase();
        let page = currentPath.split('/').pop() || 'index.html';
        if (page === '' || page === 'index') page = 'index.html';
        if (page === 'blog.html') page = 'articles.html';

        // Desktop links
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page') || link.getAttribute('href');
            if (linkPage === page) {
                link.className = 'nav-item px-3.5 py-1.5 transition-colors bg-primary-container text-on-primary-container font-semibold rounded-lg text-sm';
                link.setAttribute('aria-current', 'page');
            } else {
                link.className = 'nav-item px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium';
                link.removeAttribute('aria-current');
            }
        });

        // Mobile links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
        mobileNavLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page') || link.getAttribute('href');
            if (linkPage === page) {
                link.className = 'mobile-nav-item px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-semibold text-sm flex items-center justify-between';
                link.setAttribute('aria-current', 'page');
            } else {
                link.className = 'mobile-nav-item px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors text-sm font-medium flex items-center justify-between';
                link.removeAttribute('aria-current');
            }
        });
    }

    async function hydrateNavigationComponents() {
        if (!window.PortfolioApi) return;
        try {
            const nav = await window.PortfolioApi.getNavigation();
            if (!nav) return;

            // Brand Monogram
            if (nav.monogram) {
                document.querySelectorAll('.font-code-md.text-primary, #mobile-menu-drawer .font-code-md').forEach(el => {
                    el.textContent = nav.monogram;
                });
            }

            // Full Name & Title
            if (nav.fullName) {
                const brandEl = document.getElementById('header-brand-name');
                if (brandEl) brandEl.textContent = nav.fullName;
                document.querySelectorAll('header .font-headline-sm.text-text-primary, #mobile-menu-drawer .font-headline-sm.text-text-primary').forEach(el => {
                    el.textContent = nav.fullName;
                });
            }
            if (nav.primaryTitle) {
                const titleEl = document.getElementById('header-primary-title');
                if (titleEl) titleEl.textContent = nav.primaryTitle;
                document.querySelectorAll('header .font-code-sm.text-text-muted').forEach(el => {
                    el.textContent = nav.primaryTitle;
                });
            }

            // Availability Badge
            if (nav.availabilityText) {
                document.querySelectorAll('.font-label-badge').forEach(el => {
                    if (el.textContent.includes('Available for')) {
                        el.textContent = nav.availabilityText;
                    }
                });
            }

            // CV Download link (Direct Cloudinary URL)
            if (nav.cvFileUrl) {
                const formattedCv = window.PortfolioApi ? window.PortfolioApi.formatImageUrl(nav.cvFileUrl) : nav.cvFileUrl;
                const cvBtns = document.querySelectorAll('a[data-cv-download="true"], a.download-cv-btn, a[download]');
                cvBtns.forEach(btn => {
                    btn.setAttribute('href', formattedCv);
                    btn.setAttribute('target', '_blank');
                    btn.setAttribute('rel', 'noopener noreferrer');
                    if (nav.cvDownloadName) {
                        btn.setAttribute('download', nav.cvDownloadName);
                    }
                });
            }

            // Footer Copyright & Tagline
            if (nav.copyrightText) {
                const copyEl = document.querySelector('#site-footer .font-code-sm');
                if (copyEl && copyEl.textContent.includes('©')) {
                    copyEl.innerHTML = nav.copyrightText;
                }
            }
            if (nav.footerTagline) {
                const tagEl = document.querySelector('#site-footer .font-headline-sm');
                if (tagEl) tagEl.textContent = nav.footerTagline;
            }
        } catch (e) {
            console.debug('[components.js] Navigation dynamic hydration deferred:', e.message);
        }
    }

    async function init() {
        await Promise.all([
            loadComponent('site-header', 'header.html', HEADER_TEMPLATE),
            loadComponent('site-footer', 'footer.html', FOOTER_TEMPLATE)
        ]);

        setActiveNavigation();
        await hydrateNavigationComponents();

        // Safe CV download click handler (if clicked before hydration completes or during cold-start)
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('a[data-cv-download="true"], a.download-cv-btn');
            if (!btn) return;
            const currentHref = btn.getAttribute('href');
            if (!currentHref || currentHref === '#' || currentHref.startsWith('javascript:')) {
                e.preventDefault();
                if (window.PortfolioApi) {
                    const origHtml = btn.innerHTML;
                    btn.style.pointerEvents = 'none';
                    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span><span>Fetching CV...</span>`;
                    try {
                        const nav = await window.PortfolioApi.getNavigation();
                        if (nav && nav.cvFileUrl) {
                            const formatted = window.PortfolioApi.formatImageUrl(nav.cvFileUrl);
                            btn.setAttribute('href', formatted);
                            btn.setAttribute('target', '_blank');
                            btn.setAttribute('rel', 'noopener noreferrer');
                            window.open(formatted, '_blank');
                        } else {
                            alert('CV document is currently being updated. Please check back shortly or reach out via contact inquiry.');
                        }
                    } catch (err) {
                        alert('Backend server is currently waking up from standby. Please retry in a few seconds.');
                    } finally {
                        btn.style.pointerEvents = '';
                        btn.innerHTML = origHtml;
                    }
                }
            }
        });

        // SWR live update listener for navigation
        window.addEventListener('portfolio:data-updated', (event) => {
            if (event.detail?.endpoint === '/Navigation') {
                hydrateNavigationComponents();
            }
        });

        // Dispatch event so portfolio-core.js binds handlers to newly inserted DOM elements
        document.dispatchEvent(new CustomEvent('components:ready'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();