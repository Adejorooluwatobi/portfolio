/**
 * Portfolio Core JavaScript
 * Oluwatobi Adejoro - Fullstack Software Engineer
 * Dynamic API Hydration & Interactive Component Engine
 */

function initHeaderAndThemeListeners() {
    // Theme Toggle (Dark / Light mode)
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

    function updateThemeIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
            btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        });
    }

    window.toggleTheme = function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcons();
    };

    themeToggleBtns.forEach(btn => {
        btn.removeEventListener('click', window.toggleTheme);
        btn.addEventListener('click', window.toggleTheme);
    });
    updateThemeIcons();

    // Mobile Menu Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

    function openMobileMenu() {
        if (!mobileMenuDrawer) return;
        mobileMenuDrawer.classList.remove('translate-x-full');
        if (mobileMenuBackdrop) {
            mobileMenuBackdrop.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenuBackdrop.classList.add('opacity-100');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileMenuDrawer) return;
        mobileMenuDrawer.classList.add('translate-x-full');
        if (mobileMenuBackdrop) {
            mobileMenuBackdrop.classList.add('opacity-0', 'pointer-events-none');
            mobileMenuBackdrop.classList.remove('opacity-100');
        }
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener('click', openMobileMenu);
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.removeEventListener('click', closeMobileMenu);
        mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
    }
    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.removeEventListener('click', closeMobileMenu);
        mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
    }
}

// 2. Toast Notification Engine
window.showToast = function(message) {
    let toast = document.getElementById('portfolio-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'portfolio-toast';
        toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-high border border-border-accent text-on-surface shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none font-code-sm text-code-sm';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `
        <span class="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
        <span>${message}</span>
    `;
    toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
};

window.copyEmailToClipboard = function(email = 'Adejorotgold1@yahoo.com') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            showToast(`Copied ${email} to clipboard!`);
        }).catch(() => fallbackCopy(email));
    } else {
        fallbackCopy(email);
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${text} to clipboard!`);
    }
};

// 3. Project Filter Tabs
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-item');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(btn => {
            btn.onclick = () => {
                filterButtons.forEach(b => {
                    b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-semibold');
                    b.classList.add('bg-surface-container', 'text-on-surface-variant');
                });
                btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-semibold');
                btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = (card.getAttribute('data-category') || '').split(' ');
                    if (filter === 'all' || categories.includes(filter) || card.classList.contains(filter)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
            };
        });
    }
}

// 4. Contact Form Live Submission (REST API + Formspree fallback)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const statusBox = document.getElementById('form-status');
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                <span>Transmitting message...</span>
            `;
        }

        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const scope = document.getElementById('scope')?.value || 'general';
        const message = document.getElementById('message')?.value || '';

        let success = false;
        let successMsg = 'Your message has been received! I will reply within 24 hours.';

        // Primary: ASP.NET Core Backend API
        if (window.PortfolioApi) {
            try {
                const apiRes = await window.PortfolioApi.submitInquiry({
                    name: name,
                    email: email,
                    inquiryType: scope,
                    message: message
                });
                if (apiRes && apiRes.success) {
                    success = true;
                    if (apiRes.message) successMsg = apiRes.message;
                }
            } catch (err) {
                console.warn('[Contact] Backend submission failed, falling back to Formspree...', err);
            }
        }

        // Secondary: Formspree Fallback
        if (!success) {
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    success = true;
                }
            } catch (fallbackErr) {
                console.error('[Contact] Formspree fallback failed:', fallbackErr);
            }
        }

        if (success) {
            contactForm.reset();
            if (statusBox) {
                statusBox.className = 'p-4 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-body-sm flex items-center gap-3 transition-all';
                statusBox.innerHTML = `
                    <span class="material-symbols-outlined text-[22px] shrink-0 text-secondary">verified</span>
                    <div>
                        <div class="font-semibold text-text-primary">Message Dispatched Successfully!</div>
                        <div class="text-text-secondary">${successMsg}</div>
                    </div>
                `;
                statusBox.classList.remove('hidden');
            }
            showToast('Message sent! I will reply within 24 hours.');
        } else {
            if (statusBox) {
                statusBox.className = 'p-4 rounded-xl bg-error/15 text-error border border-error/30 font-body-sm flex items-center gap-3 transition-all';
                statusBox.innerHTML = `
                    <span class="material-symbols-outlined text-[22px] shrink-0 text-error">error</span>
                    <div>
                        <div class="font-semibold text-text-primary">Failed to dispatch message</div>
                        <div class="text-text-secondary">Please email me directly at <a href="mailto:Adejorotgold1@yahoo.com" class="underline text-primary">Adejorotgold1@yahoo.com</a>.</div>
                    </div>
                `;
                statusBox.classList.remove('hidden');
            }
        }

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    });
}

// 5. Dynamic Case Study Modal
window.openProjectModal = async function(projectId) {
    const modalBackdrop = document.getElementById('case-study-modal');
    const modalContentContainer = document.getElementById('case-study-content');
    if (!modalBackdrop || !modalContentContainer) return;

    modalContentContainer.innerHTML = `
        <div class="py-20 flex flex-col items-center justify-center gap-3">
            <div class="w-9 h-9 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span class="font-code-sm text-xs text-text-muted">Loading architectural case study...</span>
        </div>
    `;
    modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    modalBackdrop.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';

    // In-memory cached lookup
    const cachedProject = (window._loadedProjects && Array.isArray(window._loadedProjects)) ?
        window._loadedProjects.find(p => p.id === projectId || p.slug === projectId) : null;

    try {
        let project = null;
        if (window.PortfolioApi) {
            try {
                project = await window.PortfolioApi.getProjectByIdOrSlug(projectId);
            } catch (apiErr) {
                console.warn('[CaseStudy] API lookup failed, falling back to cached project:', apiErr.message);
            }
        }

        if (!project && cachedProject) {
            project = cachedProject;
        }

        if (!project) throw new Error('Project details not available.');

        const cs = project.caseStudy || {};
        const title = cs.title || project.title || 'Architectural Project';
        const category = cs.categoryLabel || project.categoryBadgeText || 'Fullstack Architecture';
        const year = cs.year || project.timeframe || '';
        const client = cs.clientName || project.clientName || 'Production System';
        const summary = cs.summary || project.shortDescription || 'Comprehensive engineering solution deployed in high-availability cloud environments.';
        
        let highlights = [];
        if (cs.highlights && Array.isArray(cs.highlights) && cs.highlights.length > 0) {
            highlights = cs.highlights.map(h => typeof h === 'string' ? h : (h.highlightText || ''));
        } else {
            highlights = [
                'Engineered for resilient web traffic, optimal caching, and sub-second latencies.',
                'Designed with modular domain patterns, automated testing, and CI/CD automation.',
                'Full cross-browser responsiveness, high accessibility, and modern UI performance.'
            ];
        }

        let techs = [];
        if (cs.technologies && Array.isArray(cs.technologies) && cs.technologies.length > 0) {
            techs = cs.technologies.map(t => typeof t === 'string' ? t : (t.name || t.tagName || ''));
        } else if (project.tags && Array.isArray(project.tags)) {
            techs = project.tags.map(t => typeof t === 'string' ? t : (t.tagName || t.name || ''));
        }

        const liveUrl = cs.liveUrl || project.liveUrl || '';
        const githubUrl = project.githubUrl || '';
        const rawImage = cs.heroImageUrl || project.imageUrl || 'assets/img/work/logo (1).png';
        const image = window.PortfolioApi ? window.PortfolioApi.formatImageUrl(rawImage) : rawImage;

        modalContentContainer.innerHTML = `
            <div class="relative w-full h-52 sm:h-72 bg-surface-container-high rounded-2xl overflow-hidden mb-6 flex items-center justify-center p-6 border border-border-subtle group">
                <img src="${image}" alt="${title}" class="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent pointer-events-none"></div>
                <span class="absolute top-4 left-4 font-label-badge text-xs px-3.5 py-1.5 rounded-full bg-surface-container-lowest/85 text-primary border border-primary/25 backdrop-blur-md shadow-sm">
                    ${category}
                </span>
                ${year ? `
                    <span class="absolute top-4 right-4 font-code-sm text-xs px-3 py-1 rounded-full bg-surface-container-lowest/85 text-secondary border border-secondary/25 backdrop-blur-md shadow-sm">
                        ${year}
                    </span>
                ` : ''}
            </div>

            <div class="mb-3">
                <h3 class="font-headline-lg text-xl sm:text-2xl text-text-primary font-bold leading-tight mb-2">${title}</h3>
                <div class="flex flex-wrap items-center gap-3">
                    <span class="font-code-sm text-xs text-primary flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        <span class="material-symbols-outlined text-[15px]">verified</span>
                        <span>Client: ${client}</span>
                    </span>
                    ${year ? `
                        <span class="font-code-sm text-xs text-text-muted flex items-center gap-1">
                            <span class="material-symbols-outlined text-[15px]">calendar_today</span>
                            <span>${year}</span>
                        </span>
                    ` : ''}
                </div>
            </div>

            <div class="p-4 rounded-xl bg-surface-container-lowest/60 border border-border-subtle mb-6">
                <h4 class="font-code-sm text-xs text-text-muted uppercase tracking-wider mb-2 font-semibold">System Architecture & Overview</h4>
                <p class="font-body-md text-sm text-text-secondary leading-relaxed">
                    ${summary}
                </p>
            </div>

            ${highlights.length > 0 ? `
                <div class="mb-6">
                    <h4 class="font-headline-sm text-sm text-text-primary font-semibold mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                        <span>Key Highlights & Engineering Feats</span>
                    </h4>
                    <ul class="space-y-2.5">
                        ${highlights.map(f => `
                            <li class="flex items-start gap-2.5 font-body-sm text-sm text-text-secondary bg-surface-container/40 p-2.5 rounded-lg border border-border-subtle/50">
                                <span class="material-symbols-outlined text-secondary text-[17px] shrink-0 mt-0.5">check_circle</span>
                                <span class="leading-relaxed">${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            ${techs.length > 0 ? `
                <div class="mb-6">
                    <h4 class="font-code-sm text-xs text-text-muted uppercase tracking-wider mb-2.5 font-semibold">Technologies & Infrastructure</h4>
                    <div class="flex flex-wrap gap-2">
                        ${techs.map(s => `
                            <span class="font-label-badge text-xs px-3 py-1 rounded-full bg-surface-container-high text-text-primary border border-border-subtle font-medium">${s}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border-subtle mt-4">
                <div class="flex flex-wrap items-center gap-2">
                    ${liveUrl ? `
                        <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-xs font-semibold flex items-center gap-1.5 hover:bg-primary hover:text-surface transition-all shadow-md">
                            <span>Inspect Live Deployment</span>
                            <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                        </a>
                    ` : ''}
                    ${githubUrl ? `
                        <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-surface-container-high text-text-primary font-code-sm text-xs font-medium flex items-center gap-1.5 hover:bg-surface-container-highest transition-colors border border-border-subtle">
                            <span>View Source</span>
                            <span class="material-symbols-outlined text-[15px]">code</span>
                        </a>
                    ` : ''}
                </div>
                <button type="button" onclick="closeProjectModal()" class="px-4 py-2 rounded-xl bg-surface-container text-text-secondary hover:text-text-primary hover:bg-surface-container-high font-headline-sm text-xs transition-colors border border-border-subtle">
                    Close
                </button>
            </div>
        `;
    } catch (err) {
        modalContentContainer.innerHTML = `
            <div class="p-8 text-center flex flex-col items-center">
                <div class="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mb-3">
                    <span class="material-symbols-outlined text-[24px]">error_outline</span>
                </div>
                <p class="text-text-primary font-semibold mb-1">Could not load case study details</p>
                <p class="text-text-muted text-xs mb-5 max-w-sm">${err.message || 'The requested project could not be retrieved at this time.'}</p>
                <button type="button" onclick="closeProjectModal()" class="px-5 py-2 rounded-xl bg-surface-container-high text-text-primary hover:bg-surface-container text-xs font-medium border border-border-subtle transition-colors">Close</button>
            </div>
        `;
    }
};

window.closeProjectModal = function() {
    const modalBackdrop = document.getElementById('case-study-modal');
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('opacity-0', 'pointer-events-none');
    modalBackdrop.classList.remove('opacity-100');
    document.body.style.overflow = '';
};

// 6. Developer Avatar Lightbox Modal
window.openAvatarModal = function() {
    const modal = document.getElementById('avatar-lightbox-modal');
    const imgEl = document.getElementById('avatar-lightbox-img');
    const heroAvatar = document.getElementById('hero-avatar');
    if (!modal) return;

    if (imgEl && heroAvatar && heroAvatar.src && heroAvatar.style.display !== 'none') {
        imgEl.src = heroAvatar.src;
        imgEl.alt = heroAvatar.alt || 'Developer Portrait';
    } else if (imgEl) {
        imgEl.src = 'assets/img/hero/oluwatobi-portrait.jpg';
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    const card = document.getElementById('avatar-lightbox-card');
    if (card) {
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }
    document.body.style.overflow = 'hidden';
};

window.closeAvatarModal = function() {
    const modal = document.getElementById('avatar-lightbox-modal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100');
    const card = document.getElementById('avatar-lightbox-card');
    if (card) {
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
    document.body.style.overflow = '';
};

// In-memory articles cache populated dynamically from API
window._loadedArticles = [];

window.openArticleModal = async function(idOrSlug) {
    const modalBackdrop = document.getElementById('article-detail-modal');
    const modalContentContainer = document.getElementById('article-modal-content');
    if (!modalBackdrop || !modalContentContainer) return;

    modalContentContainer.innerHTML = `
        <div class="py-16 flex flex-col items-center justify-center gap-3">
            <div class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span class="font-code-sm text-xs text-text-muted">Loading article details...</span>
        </div>
    `;
    modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    modalBackdrop.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';

    try {
        let article = null;
        if (window._loadedArticles && Array.isArray(window._loadedArticles)) {
            article = window._loadedArticles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
        }

        if (!article && window.PortfolioApi) {
            try {
                article = await window.PortfolioApi.getArticleBySlug(idOrSlug);
            } catch (e) {
                // Ignore API error and fallback gracefully
            }
        }

        if (!article) throw new Error('Article details could not be found');

        const title = article.title || 'Technical Article';
        const category = article.category || 'Backend Engineering';
        const readTime = article.readTimeMinutes ? `${article.readTimeMinutes} min read` : '5 min read';
        const publicationType = article.publicationType || 'Technical Guide';
        const dateStr = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Published';
        const rawImg = article.imageUrl || 'assets/img/blog/blog-img1.png';
        const image = window.PortfolioApi ? window.PortfolioApi.formatImageUrl(rawImg) : rawImg;
        const excerpt = article.excerpt || '';
        const tags = article.tags || [];
        const tagsHtml = tags.map(t => {
            const name = typeof t === 'string' ? t : (t.tagName || t.name);
            return `<span class="font-label-badge text-xs px-2.5 py-1 rounded bg-surface-container text-text-primary border border-border-subtle">${name}</span>`;
        }).join('');

        const modalLinksHtml = (article.links && article.links.length > 0)
            ? article.links.map(l => `
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-xs font-semibold flex items-center gap-1.5 hover:bg-primary hover:text-surface transition-all shadow-md">
                    <span>${l.title || 'Open Article'}</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_outward</span>
                </a>
            `).join('')
            : `
                ${article.linkedinUrl ? `
                    <a href="${article.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-xs font-semibold flex items-center gap-1.5 hover:bg-primary hover:text-surface transition-all shadow-md">
                        <span>Read Full Article on LinkedIn</span>
                        <span class="material-symbols-outlined text-[16px]">arrow_outward</span>
                    </a>
                ` : ''}
                ${article.twitterUrl ? `
                    <a href="${article.twitterUrl}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-lg bg-surface-container-high text-text-secondary hover:text-text-primary hover:bg-surface-container-highest font-headline-sm text-xs font-medium flex items-center gap-1.5 border border-border-subtle transition-all">
                        <span>Discussion on X</span>
                        <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                ` : ''}
            `;

        modalContentContainer.innerHTML = `
            <div class="relative w-full h-56 sm:h-72 bg-surface-container-high rounded-xl overflow-hidden mb-6 flex items-center justify-center border border-border-subtle">
                <img src="${image}" alt="${article.imageAlt || title}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent pointer-events-none"></div>
                <span class="absolute top-4 left-4 font-label-badge text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-primary border border-primary/20 backdrop-blur-md">
                    ${category}
                </span>
                <span class="absolute top-4 right-4 font-code-sm text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-text-muted border border-border-subtle backdrop-blur-md">
                    ${readTime}
                </span>
            </div>

            <div class="flex items-center gap-2 font-code-sm text-xs text-text-muted mb-3">
                <span class="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                <span>${dateStr}</span>
                <span>•</span>
                <span class="text-secondary font-medium">${publicationType}</span>
            </div>

            <h3 class="font-headline-lg text-xl sm:text-2xl text-text-primary font-bold mb-4 leading-snug">
                ${title}
            </h3>

            <div class="font-body-md text-sm sm:text-base text-text-secondary leading-relaxed mb-6 space-y-3">
                <p>${excerpt}</p>
            </div>

            ${tagsHtml ? `
                <div class="mb-6">
                    <h4 class="font-code-sm text-xs text-text-muted uppercase tracking-wider mb-2">Core Technologies & Concepts</h4>
                    <div class="flex flex-wrap gap-2">
                        ${tagsHtml}
                    </div>
                </div>
            ` : ''}

            <div class="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border-subtle">
                <div class="flex flex-wrap items-center gap-2">
                    ${modalLinksHtml}
                </div>
                <button type="button" onclick="closeArticleModal()" class="px-4 py-2 rounded-lg bg-surface-container-high text-text-secondary hover:text-text-primary font-headline-sm text-xs transition-colors">
                    Close
                </button>
            </div>
            ${article.footerAnnotation ? `
                <div class="mt-3 text-right">
                    <span class="font-code-sm text-[11px] text-text-muted">Reference: ${article.footerAnnotation}</span>
                </div>
            ` : ''}
        `;
    } catch (err) {
        modalContentContainer.innerHTML = `
            <div class="p-6 text-center">
                <p class="text-error font-medium mb-3">Could not load article details.</p>
                <button type="button" onclick="closeArticleModal()" class="px-4 py-2 rounded-lg bg-surface-container-high text-text-primary text-xs">Close</button>
            </div>
        `;
    }
};

window.closeArticleModal = function() {
    const modalBackdrop = document.getElementById('article-detail-modal');
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('opacity-0', 'pointer-events-none');
    modalBackdrop.classList.remove('opacity-100');
    document.body.style.overflow = '';
};

// 6. Dynamic Page Hydration Modules

/** Hydrate Contact Details */
async function hydrateContactPage() {
    if (!window.PortfolioApi || !document.getElementById('contact-form')) return;
    try {
        const info = await window.PortfolioApi.getContactInfo();
        if (!info) return;

        if (info.email) {
            const emailLink = document.getElementById('contact-email-link');
            if (emailLink) {
                emailLink.href = `mailto:${info.email}`;
                emailLink.textContent = info.email;
            }
            const copyBtn = document.getElementById('contact-email-copy-btn');
            if (copyBtn) {
                copyBtn.setAttribute('onclick', `copyEmailToClipboard('${info.email}')`);
            }
            document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
                a.href = `mailto:${info.email}`;
                a.textContent = info.email;
            });
        }
        if (info.phone) {
            const phoneLink = document.getElementById('contact-phone-link');
            if (phoneLink) {
                phoneLink.href = `tel:${info.phone}`;
                phoneLink.textContent = info.phoneDisplay || info.phone;
            }
            document.querySelectorAll('a[href^="tel:"]').forEach(a => {
                a.href = `tel:${info.phone}`;
                a.textContent = info.phoneDisplay || info.phone;
            });
        }
        if (info.whatsappUrl) {
            const wa = document.getElementById('contact-whatsapp-link') || document.querySelector('a[href*="wa.me"]');
            if (wa) wa.href = info.whatsappUrl;
        }
        if (info.responseGuarantee) {
            const guaranteeEl = document.getElementById('contact-response-guarantee');
            if (guaranteeEl) {
                guaranteeEl.textContent = info.responseGuarantee;
            }
        }
        if (info.availabilityText) {
            const availBadge = document.getElementById('contact-availability-badge');
            if (availBadge) {
                availBadge.textContent = info.availabilityText;
            }
        }
        if (info.engagementScope) {
            const scopeEl = document.getElementById('contact-engagement-scope');
            if (scopeEl) {
                scopeEl.textContent = info.engagementScope;
            }
        }
    } catch (e) {
        console.debug('[Contact] Hydration deferred:', e.message);
    }
}

/** Hydrate Featured Works / Portfolio Grid */
async function hydratePortfolioPage() {
    const grid = document.getElementById('projects-grid');
    if (!window.PortfolioApi || !grid) return;
    try {
        const data = await window.PortfolioApi.getProjects();
        if (!data || !data.projects || !data.projects.length) {
            grid.innerHTML = `
                <div class="col-span-1 lg:col-span-2 py-16 px-6 text-center bg-surface-card rounded-2xl border border-border-subtle shadow-xl">
                    <div class="w-16 h-16 rounded-2xl bg-surface-container-high text-primary mx-auto mb-4 flex items-center justify-center border border-border-subtle">
                        <span class="material-symbols-outlined text-[32px]">folder_open</span>
                    </div>
                    <h3 class="font-headline-md text-xl text-text-primary font-bold mb-2">No Projects Published Yet</h3>
                    <p class="font-body-md text-sm text-text-secondary max-w-md mx-auto mb-6">
                        Projects and case studies are currently being curated. Check back shortly or explore my live repositories directly on GitHub.
                    </p>
                    <a href="https://github.com/Adejorotgold1" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-xs font-semibold hover:bg-primary hover:text-surface transition-all shadow-md">
                        <span>Explore GitHub Profile</span>
                        <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                </div>
            `;
            return;
        }

        // Dynamic Category Filter Pills from backend categories
        const filterContainer = document.getElementById('project-categories-filter');
        if (filterContainer && data.categories && Array.isArray(data.categories) && data.categories.length) {
            const extraCats = data.categories.filter(c => c.slug !== 'all' && c.slug !== '');
            let pillsHtml = `
                <span class="font-code-sm text-xs text-text-muted mr-1">Filter:</span>
                <button type="button" class="project-filter-btn px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-code-sm text-xs font-semibold transition-all" data-filter="all">All</button>
            `;
            extraCats.forEach(c => {
                pillsHtml += `
                    <button type="button" class="project-filter-btn px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-code-sm text-xs transition-all border border-border-subtle" data-filter="${c.slug}">${c.label}</button>
                `;
            });
            filterContainer.innerHTML = pillsHtml;
        }

        grid.innerHTML = data.projects.map(p => {
            const categoryClasses = (p.categorySlugs || []).join(' ') + ' all';
            const categoryAttr = (p.categorySlugs || []).join(' ') + ' all';
            const mainCategory = p.categoryBadgeText || 'Fullstack Project';
            const tags = p.tags || [];
            const tagsHtml = tags.map(t => {
                const name = typeof t === 'string' ? t : t.tagName;
                return `<span class="font-label-badge text-xs px-2.5 py-1 rounded bg-surface-container text-text-primary border border-border-subtle">${name}</span>`;
            }).join('');

            const projectImgUrl = p.imageUrl ? (window.PortfolioApi ? window.PortfolioApi.formatImageUrl(p.imageUrl) : p.imageUrl) : null;
            const imageHtml = projectImgUrl ? 
                `<img class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl" src="${projectImgUrl}" alt="${p.imageAlt || p.title}"/>` :
                `<div class="w-16 h-16 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center border border-primary/20"><span class="material-symbols-outlined text-[32px]">${p.iconKey || 'layers'}</span></div>`;

            return `
                <div class="project-item ${categoryClasses} bg-surface-card rounded-2xl overflow-hidden backdrop-blur-xl border border-border-subtle shadow-xl flex flex-col group hover:border-primary/50 transition-all duration-300" data-category="${categoryAttr}">
                    <div class="h-64 overflow-hidden relative bg-surface-container-high flex items-center justify-center p-8">
                        ${imageHtml}
                        <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent pointer-events-none"></div>
                        <span class="absolute top-4 left-4 font-label-badge text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-primary border border-primary/20 backdrop-blur-md">${mainCategory}</span>
                        <span class="absolute top-4 right-4 font-code-sm text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-secondary border border-secondary/20 backdrop-blur-md">${p.timeframe || ''}</span>
                    </div>
                    <div class="p-7 flex flex-col flex-grow">
                        <div class="flex items-center justify-between mb-2">
                            <h2 class="font-headline-md text-xl text-text-primary font-bold">${p.title}</h2>
                        </div>
                        <p class="font-body-md text-sm text-text-secondary mb-5 leading-relaxed">
                            ${p.shortDescription || ''}
                        </p>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${tagsHtml}
                        </div>
                        <div class="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-border-subtle">
                            <div class="flex items-center gap-2">
                                ${p.hasCaseStudy ? `
                                    <button type="button" onclick="openProjectModal('${p.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-xs font-semibold hover:bg-primary hover:text-surface transition-all shadow-md">
                                        <span>Case Study</span>
                                        <span class="material-symbols-outlined text-[16px]">visibility</span>
                                    </button>
                                ` : ''}
                                ${p.liveUrl ? `
                                    <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-text-secondary hover:text-text-primary hover:bg-surface-container-high font-code-sm text-xs transition-colors border border-border-subtle" title="Inspect Live Deployment">
                                        <span>Live</span>
                                        <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                                    </a>
                                ` : ''}
                                ${p.githubUrl ? `
                                    <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-text-secondary hover:text-text-primary hover:bg-surface-container-high font-code-sm text-xs transition-colors border border-border-subtle" title="Inspect Code Repository">
                                        <span>GitHub</span>
                                        <span class="material-symbols-outlined text-[14px]">code</span>
                                    </a>
                                ` : ''}
                            </div>
                            <span class="font-code-sm text-[11px] text-text-muted">${p.clientName || 'Production'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        initProjectFilters();
    } catch (e) {
        console.warn('[Portfolio] Failed to load projects:', e.message);
        grid.innerHTML = `
            <div class="col-span-1 lg:col-span-2 py-14 px-6 text-center bg-surface-card rounded-2xl border border-error/30 shadow-xl">
                <div class="w-14 h-14 rounded-2xl bg-error/10 text-error mx-auto mb-4 flex items-center justify-center border border-error/20">
                    <span class="material-symbols-outlined text-[28px]">cloud_off</span>
                </div>
                <h3 class="font-headline-md text-lg text-text-primary font-bold mb-2">Unable to Connect to Cloud Backend</h3>
                <p class="font-body-md text-sm text-text-secondary max-w-md mx-auto mb-5">
                    The backend server may be waking up from free-tier cold standby or temporarily unreachable.
                </p>
                <button type="button" onclick="hydratePortfolioPage()" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-text-primary hover:bg-primary hover:text-surface border border-border-subtle font-headline-sm text-xs font-semibold transition-all">
                    <span class="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Retry Connection</span>
                </button>
            </div>
        `;
    }
}

/** Hydrate Articles & Publications Grid */
async function hydrateArticlesPage() {
    const grid = document.getElementById('articles-grid');
    if (!window.PortfolioApi || !grid) return;
    try {
        let articles = await window.PortfolioApi.getArticles();
        if (articles && articles.value && Array.isArray(articles.value)) articles = articles.value;

        if (!Array.isArray(articles) || !articles.length) {
            grid.innerHTML = `
                <div class="col-span-1 lg:col-span-2 py-16 px-6 text-center bg-surface-card rounded-2xl border border-border-subtle shadow-xl">
                    <div class="w-16 h-16 rounded-2xl bg-surface-container-high text-primary mx-auto mb-4 flex items-center justify-center border border-border-subtle">
                        <span class="material-symbols-outlined text-[32px]">article</span>
                    </div>
                    <h3 class="font-headline-md text-xl text-text-primary font-bold mb-2">No Articles Published Yet</h3>
                    <p class="font-body-md text-sm text-text-secondary max-w-md mx-auto mb-6">
                        Technical articles and architecture guides are currently being prepared. Check back shortly for new publications.
                    </p>
                </div>
            `;
            return;
        }

        // Store articles in memory for instant modal viewing
        window._loadedArticles = articles;

        grid.innerHTML = articles.map(a => {
            const tags = a.tags || [];
            const tagsHtml = tags.map(t => {
                const name = typeof t === 'string' ? t : (t.tagName || t.name);
                return `<span class="font-label-badge text-xs px-2.5 py-1 rounded bg-surface-container text-text-primary border border-border-subtle">${name}</span>`;
            }).join('');

            const dateStr = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Published';
            const readTime = a.readTimeMinutes ? `${a.readTimeMinutes} min read` : '5 min read';
            const rawArticleImg = a.imageUrl || 'assets/img/blog/blog-img1.png';
            const image = window.PortfolioApi ? window.PortfolioApi.formatImageUrl(rawArticleImg) : rawArticleImg;

            const linksHtml = (a.links && a.links.length > 0)
                ? a.links.map(l => `
                    <a class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface-container text-text-primary hover:bg-surface-container-high hover:text-primary font-body-md text-xs font-medium transition-all border border-border-subtle" href="${l.url}" rel="noopener noreferrer" target="_blank">
                        <span>${l.title || 'Link'}</span>
                        <span class="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </a>
                `).join('')
                : `
                    ${a.linkedinUrl ? `
                        <a class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface-container text-text-primary hover:bg-surface-container-high hover:text-primary font-body-md text-xs font-medium transition-all border border-border-subtle" href="${a.linkedinUrl}" rel="noopener noreferrer" target="_blank">
                            <span>LinkedIn</span>
                            <span class="material-symbols-outlined text-[14px]">arrow_outward</span>
                        </a>
                    ` : ''}
                    ${a.twitterUrl ? `
                        <a class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-surface-container text-text-secondary hover:text-text-primary font-code-sm text-xs transition-colors border border-border-subtle" href="${a.twitterUrl}" rel="noopener noreferrer" target="_blank" title="Discussion">
                            <span>X / Thread</span>
                        </a>
                    ` : ''}
                `;

            return `
                <article class="bg-surface-card rounded-2xl overflow-hidden backdrop-blur-xl border border-border-subtle shadow-xl flex flex-col group hover:border-primary/50 transition-all duration-300">
                    <div onclick="openArticleModal('${a.id}')" class="h-60 overflow-hidden relative bg-surface-container-high cursor-pointer">
                        <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${image}" alt="${a.imageAlt || a.title}"/>
                        <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent pointer-events-none"></div>
                        <span class="absolute top-4 left-4 font-label-badge text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-primary border border-primary/20 backdrop-blur-md">${a.category || 'Engineering'}</span>
                        <span class="absolute top-4 right-4 font-code-sm text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-text-muted border border-border-subtle backdrop-blur-md">${readTime}</span>
                    </div>
                    <div class="p-7 flex flex-col flex-grow">
                        <div class="flex items-center gap-2 font-code-sm text-xs text-text-muted mb-2">
                            <span>${dateStr}</span>
                            <span>•</span>
                            <span class="text-secondary font-medium">${a.publicationType || 'Software Development Guide'}</span>
                        </div>
                        <h2 onclick="openArticleModal('${a.id}')" class="font-headline-md text-xl text-text-primary font-bold mb-3 cursor-pointer hover:text-primary transition-colors">
                            ${a.title}
                        </h2>
                        <p class="font-body-md text-sm text-text-secondary mb-6 leading-relaxed">
                            ${a.excerpt || ''}
                        </p>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${tagsHtml}
                        </div>
                        <div class="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle">
                            <div class="flex items-center gap-2 flex-wrap">
                                <button type="button" onclick="openArticleModal('${a.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-high text-text-primary hover:bg-primary-container hover:text-on-primary-container font-body-md text-xs font-medium transition-all border border-border-subtle shadow-sm">
                                    <span class="material-symbols-outlined text-[15px]">visibility</span>
                                    <span>Details</span>
                                </button>
                                ${linksHtml}
                            </div>
                            <span class="font-code-sm text-[11px] text-text-muted">${a.footerAnnotation || 'Oluwatobi Adejoro'}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    } catch (e) {
        console.warn('[Articles] Failed to load articles:', e.message);
        grid.innerHTML = `
            <div class="col-span-1 lg:col-span-2 py-14 px-6 text-center bg-surface-card rounded-2xl border border-error/30 shadow-xl">
                <div class="w-14 h-14 rounded-2xl bg-error/10 text-error mx-auto mb-4 flex items-center justify-center border border-error/20">
                    <span class="material-symbols-outlined text-[28px]">cloud_off</span>
                </div>
                <h3 class="font-headline-md text-lg text-text-primary font-bold mb-2">Unable to Connect to Cloud Backend</h3>
                <p class="font-body-md text-sm text-text-secondary max-w-md mx-auto mb-5">
                    The backend server may be waking up from free-tier cold standby or temporarily unreachable.
                </p>
                <button type="button" onclick="hydrateArticlesPage()" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-text-primary hover:bg-primary hover:text-surface border border-border-subtle font-headline-sm text-xs font-semibold transition-all">
                    <span class="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Retry Connection</span>
                </button>
            </div>
        `;
    }
}

/** Hydrate Resume, Experience & Skills */
async function hydrateResumePage() {
    const timeline = document.getElementById('experience-timeline');
    const skillsGrid = document.getElementById('skills-matrix');
    if (!window.PortfolioApi || (!timeline && !skillsGrid)) return;

    try {
        const resume = await window.PortfolioApi.getResume();
        if (!resume) return;

        // 0. Dynamic CV Download Link
        if (resume.cvFileUrl) {
            const formattedCv = window.PortfolioApi ? window.PortfolioApi.formatImageUrl(resume.cvFileUrl) : resume.cvFileUrl;
            const cvBtns = document.querySelectorAll('a[data-cv-download="true"], a.download-cv-btn');
            cvBtns.forEach(btn => {
                btn.setAttribute('href', formattedCv);
                btn.setAttribute('target', '_blank');
                btn.setAttribute('rel', 'noopener noreferrer');
                if (resume.cvDownloadName) {
                    btn.setAttribute('download', resume.cvDownloadName);
                }
            });
        }

        // 1. Work Experience Timeline
        if (timeline && resume.experiences && resume.experiences.length) {
            timeline.innerHTML = resume.experiences.map((exp, idx) => {
                const ringColor = idx === 0 ? 'bg-primary-container ring-4 ring-surface' : 'bg-secondary ring-4 ring-surface';
                const techs = exp.technologies || [];
                const techsHtml = techs.map(t => {
                    const name = typeof t === 'string' ? t : t.name;
                    return `<span class="font-label-badge text-xs px-2.5 py-0.5 rounded bg-surface-container text-text-muted border border-border-subtle">${name}</span>`;
                }).join('');

                const jobTitle = exp.jobTitle || exp.roleTitle || 'Software Engineer';
                const timeframe = exp.dateRange || exp.timeframe || '';
                const desc = exp.description || exp.summaryDescription || '';

                return `
                    <div class="relative group">
                        <div class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full ${ringColor}"></div>
                        <div class="bg-surface-card rounded-2xl p-6 sm:p-7 backdrop-blur-xl border border-border-subtle hover:border-primary/40 transition-colors shadow-lg">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                <h3 class="font-headline-sm text-lg text-text-primary font-semibold">${jobTitle}</h3>
                                <span class="font-code-sm text-xs text-secondary font-medium px-2.5 py-0.5 rounded bg-surface-container-high border border-border-subtle w-fit">${timeframe}</span>
                            </div>
                            <span class="font-code-sm text-xs text-primary block mb-3 font-medium">${exp.companyName} • ${exp.employmentType || 'Full-Time'}</span>
                            <p class="font-body-md text-sm text-text-secondary leading-relaxed mb-4">
                                ${desc}
                            </p>
                            <div class="flex flex-wrap gap-2">
                                ${techsHtml}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 2. Skills Matrix
        if (skillsGrid && resume.skillCategories && resume.skillCategories.length) {
            skillsGrid.innerHTML = resume.skillCategories.map(cat => {
                const allSkills = cat.skills || cat.items || [];
                const primarySkills = allSkills.filter(s => s.proficiencyPercent != null && s.proficiencyPercent > 0 && s.isPrimary !== false);
                const secondarySkills = allSkills.filter(s => s.proficiencyPercent == null || s.proficiencyPercent <= 0 || s.isPrimary === false);
                const accentColor = cat.accentColorToken || 'primary';
                const icon = cat.icon || cat.iconKey || 'terminal';

                const secondaryHtml = secondarySkills.length ? `
                    <div class="mt-6 pt-6 border-t border-border-subtle flex flex-wrap gap-1.5">
                        ${secondarySkills.map(s => `<span class="font-code-sm text-xs px-2.5 py-1 rounded bg-surface-container text-text-secondary border border-border-subtle">${s.name}</span>`).join('')}
                    </div>
                ` : '';

                return `
                    <div class="bg-surface-card rounded-2xl p-6 backdrop-blur-xl border border-border-subtle hover:border-primary/40 transition-colors shadow-lg">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-${accentColor} border border-border-subtle">
                                <span class="material-symbols-outlined text-[20px]">${icon}</span>
                            </div>
                            <div>
                                <h3 class="font-headline-sm text-lg text-text-primary font-bold">${cat.title}</h3>
                                <span class="font-code-sm text-xs text-text-muted">${cat.subtitle || 'Production Ecosystem'}</span>
                            </div>
                        </div>
                        <div class="space-y-4">
                            ${primarySkills.map(s => `
                                <div>
                                    <div class="flex justify-between font-code-sm text-xs text-text-secondary mb-1">
                                        <span>${s.name}</span>
                                        <span class="text-text-primary font-semibold">${s.proficiencyPercent}%</span>
                                    </div>
                                    <div class="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style="width: ${s.proficiencyPercent}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        ${secondaryHtml}
                    </div>
                `;
            }).join('');
        }
    } catch (e) {
        console.debug('[Resume] Hydration deferred:', e.message);
    }
}

/** Hydrate Index / Home Page */
async function hydrateHomePage() {
    const heroHeadline = document.getElementById('hero-headline');
    if (!window.PortfolioApi || !heroHeadline) return;

    try {
        const [heroRes, profileRes] = await Promise.all([
            window.PortfolioApi.getHero().catch(() => null),
            window.PortfolioApi.getProfile().catch(() => null)
        ]);

        const hero = heroRes || profileRes?.hero;
        const profile = profileRes?.profile || profileRes;

        if (hero) {
            if (hero.headline) heroHeadline.textContent = hero.headline;
            if (hero.categoryBadgeText) {
                const badge = document.getElementById('hero-badge-text');
                if (badge) badge.textContent = hero.categoryBadgeText;
            }
            if (hero.bioLead) {
                const lead = document.getElementById('hero-bio-lead');
                if (lead) lead.textContent = hero.bioLead;
            }
            if (hero.bioFrontend) {
                const fe = document.getElementById('hero-bio-frontend');
                if (fe) fe.innerHTML = hero.bioFrontend;
            }
            if (hero.bioBackend) {
                const be = document.getElementById('hero-bio-backend');
                if (be) be.innerHTML = hero.bioBackend;
            }
        }

        if (profile) {
            // 1. Developer Identity Card
            if (profile.fullName) {
                const nameEl = document.getElementById('hero-full-name');
                if (nameEl) nameEl.textContent = profile.fullName;
            }
            if (profile.primaryTitle) {
                const titleEl = document.getElementById('hero-primary-title');
                if (titleEl) titleEl.textContent = profile.primaryTitle;
            }
            const avatarUrl = profile.avatarImageUrl ? (window.PortfolioApi ? window.PortfolioApi.formatImageUrl(profile.avatarImageUrl) : profile.avatarImageUrl) : null;
            const heroAvatarEl = document.getElementById('hero-avatar');
            const heroFallbackEl = document.getElementById('hero-avatar-fallback');
            if (heroAvatarEl) {
                if (avatarUrl) {
                    heroAvatarEl.src = avatarUrl;
                    heroAvatarEl.style.display = 'block';
                    if (heroFallbackEl) heroFallbackEl.style.display = 'none';
                    if (profile.avatarAltText || profile.fullName) {
                        heroAvatarEl.alt = profile.avatarAltText || `${profile.fullName} - Photo`;
                    }
                } else {
                    heroAvatarEl.style.display = 'none';
                    if (heroFallbackEl) heroFallbackEl.style.display = 'flex';
                }
            }

            const sidebarAvatarEl = document.getElementById('sidebar-avatar');
            const sidebarFallbackEl = document.getElementById('sidebar-avatar-fallback');
            if (sidebarAvatarEl) {
                if (avatarUrl) {
                    sidebarAvatarEl.src = avatarUrl;
                    sidebarAvatarEl.style.display = 'block';
                    if (sidebarFallbackEl) sidebarFallbackEl.style.display = 'none';
                } else {
                    sidebarAvatarEl.style.display = 'none';
                    if (sidebarFallbackEl) sidebarFallbackEl.style.display = 'flex';
                }
            }
            if (profile.locationDisplay || profile.location) {
                const locEl = document.getElementById('hero-developer-location');
                if (locEl) locEl.textContent = profile.locationDisplay || profile.location;
            }
            if (profile.employmentStatus) {
                const statusEl = document.getElementById('hero-developer-status');
                if (statusEl) statusEl.textContent = profile.employmentStatus;
            }
            if (profile.responseTime) {
                const respEl = document.getElementById('hero-developer-response');
                if (respEl) respEl.textContent = profile.responseTime;
            }

            // 2. Metrics counters
            if (profile.yearsExperience) {
                const expEl = document.getElementById('metric-years-experience');
                if (expEl) expEl.innerHTML = `${profile.yearsExperience}+ <span class="font-code-sm text-xs text-text-secondary font-normal">Years</span>`;
            }
            if (profile.projectsCompleted) {
                const projEl = document.getElementById('metric-projects-completed');
                if (projEl) projEl.innerHTML = `${profile.projectsCompleted}+ <span class="font-code-sm text-xs text-text-secondary font-normal">Projects</span>`;
            }

            // 3. What I Do (Core Competencies)
            if (profile.disciplineCards && Array.isArray(profile.disciplineCards) && profile.disciplineCards.length > 0) {
                const compContainer = document.getElementById('competencies-container');
                if (compContainer) {
                    const fallbackAccents = [
                        { border: 'hover:border-primary/40', iconBox: 'bg-primary-container/20 text-primary border-primary/20' },
                        { border: 'hover:border-secondary/40', iconBox: 'bg-secondary/15 text-secondary border-secondary/20' },
                        { border: 'hover:border-tertiary/40', iconBox: 'bg-tertiary-container/40 text-tertiary border-tertiary/20' },
                        { border: 'hover:border-primary/40', iconBox: 'bg-primary-container/20 text-primary border-primary/20' }
                    ];

                    compContainer.innerHTML = profile.disciplineCards.map((card, idx) => {
                        const accent = fallbackAccents[idx % fallbackAccents.length];
                        const customColor = card.accentColor || null;
                        const iconBoxStyle = customColor ? `style="background-color: ${customColor}22; color: ${customColor}; border-color: ${customColor}44;"` : '';
                        const iconBoxClass = customColor ? 'w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm' : `w-12 h-12 rounded-xl ${accent.iconBox} flex items-center justify-center border`;
                        const cardHoverAttrs = customColor ? `style="--card-accent: ${customColor};" onmouseenter="this.style.borderColor='${customColor}66'" onmouseleave="this.style.borderColor=''"` : '';
                        const cardBorderClass = customColor ? 'hover:shadow-lg' : accent.border;

                        const rawTags = card.tags || [];
                        const tagsHtml = rawTags.map(t => {
                            const tagName = typeof t === 'string' ? t : (t.tagName || '');
                            return `<span class="font-label-badge text-xs px-3 py-1 rounded-full bg-surface-container-high text-on-surface border border-border-subtle">${tagName}</span>`;
                        }).join('');

                        return `
                            <div class="bg-surface-card rounded-2xl p-8 backdrop-blur-xl border border-border-subtle relative overflow-hidden group ${cardBorderClass} transition-all duration-300" ${cardHoverAttrs}>
                                <div class="flex items-start justify-between mb-6">
                                    <div class="${iconBoxClass}" ${iconBoxStyle}>
                                        <span class="material-symbols-outlined text-[28px]">${card.icon || 'palette'}</span>
                                    </div>
                                    <span class="font-code-sm text-xs text-text-muted">${card.indexTag || ''}</span>
                                </div>
                                <h3 class="font-headline-md text-xl text-text-primary font-semibold mb-3">${card.title}</h3>
                                <p class="font-body-md text-sm text-text-secondary leading-relaxed mb-6">
                                    ${card.description}
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    ${tagsHtml}
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }

            // 4. Architecture & Code Philosophy Badges
            if (profile.philosophyCards && Array.isArray(profile.philosophyCards) && profile.philosophyCards.length > 0) {
                const philContainer = document.getElementById('philosophy-cards-container');
                if (philContainer) {
                    const fallbackColors = ['#8b5cf6', '#10b981', '#0ea5e9'];
                    philContainer.innerHTML = profile.philosophyCards.map((card, idx) => {
                        const accentColor = card.accentColor || fallbackColors[idx % fallbackColors.length];
                        return `
                            <div class="bg-surface-card rounded-xl p-5 border border-border-subtle shadow-sm transition-all duration-200 group"
                                 onmouseenter="this.style.borderColor='${accentColor}80'; this.style.boxShadow='0 10px 25px -5px ${accentColor}20';"
                                 onmouseleave="this.style.borderColor=''; this.style.boxShadow='';">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                                     style="background-color: ${accentColor}1a; color: ${accentColor}; border: 1px solid ${accentColor}33;">
                                    <span class="material-symbols-outlined text-[22px]">${card.icon || 'speed'}</span>
                                </div>
                                <h3 class="font-headline-sm text-base text-text-primary font-semibold mb-1">${card.title || ''}</h3>
                                <p class="font-body-sm text-xs text-text-muted leading-relaxed">${card.description || ''}</p>
                            </div>
                        `;
                    }).join('');
                }
            }
        }
    } catch (e) {
        console.debug('[Home] Hydration deferred:', e.message);
    }
}

// 7. Initialize All Handlers & Hydration on Load
document.addEventListener('components:ready', () => {
    initHeaderAndThemeListeners();
});

document.addEventListener('DOMContentLoaded', () => {
    initHeaderAndThemeListeners();
    initProjectFilters();
    initContactForm();

    // Trigger page-specific hydrations (instant 0ms if cached by SWR/Prefetch)
    hydrateContactPage();
    hydratePortfolioPage();
    hydrateArticlesPage();
    hydrateResumePage();
    hydrateHomePage();

    // SWR Live Update Listener: seamlessly refresh UI if background revalidation detects changed data
    window.addEventListener('portfolio:data-updated', (event) => {
        const ep = event.detail?.endpoint;
        if (ep === '/Projects') {
            hydratePortfolioPage();
        } else if (ep === '/Articles') {
            hydrateArticlesPage();
        } else if (ep === '/Resume') {
            hydrateResumePage();
        } else if (ep === '/Profile' || ep === '/Profile/hero') {
            hydrateHomePage();
        } else if (ep === '/Contact/info') {
            hydrateContactPage();
        }
    });

    // Idle Prefetch: Warm all other page caches during idle time for 0ms transitions
    if (window.PortfolioApi && typeof window.PortfolioApi.prefetchAll === 'function') {
        window.PortfolioApi.prefetchAll();
    }

    // Modal listeners
    const modalCloseBtn = document.getElementById('case-study-close');
    const modalBackdrop = document.getElementById('case-study-modal');
    if (modalCloseBtn) modalCloseBtn.onclick = closeProjectModal;
    if (modalBackdrop) {
        modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) closeProjectModal();
        };
    }

    const articleModalCloseBtn = document.getElementById('article-modal-close');
    const articleModalBackdrop = document.getElementById('article-detail-modal');
    if (articleModalCloseBtn) articleModalCloseBtn.onclick = closeArticleModal;
    if (articleModalBackdrop) {
        articleModalBackdrop.onclick = (e) => {
            if (e.target === articleModalBackdrop) closeArticleModal();
        };
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
            closeArticleModal();
            closeAvatarModal();
            const drawer = document.getElementById('mobile-menu-drawer');
            const backdrop = document.getElementById('mobile-menu-backdrop');
            if (drawer) drawer.classList.add('translate-x-full');
            if (backdrop) {
                backdrop.classList.add('opacity-0', 'pointer-events-none');
                backdrop.classList.remove('opacity-100');
            }
            document.body.style.overflow = '';
        }
    });
});
