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
        <div class="py-16 flex flex-col items-center justify-center gap-3">
            <div class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span class="font-code-sm text-xs text-text-muted">Loading architectural case study...</span>
        </div>
    `;
    modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    modalBackdrop.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';

    try {
        let project = null;
        if (window.PortfolioApi) {
            project = await window.PortfolioApi.getProjectByIdOrSlug(projectId);
        }

        if (!project) throw new Error('Project not found');

        const cs = project.caseStudy || {};
        const title = cs.title || project.title;
        const category = cs.categoryLabel || project.categoryBadgeText || 'Fullstack Architecture';
        const year = cs.year || project.timeframe || '';
        const client = cs.clientName || project.clientName || 'Verified Client';
        const summary = cs.summary || project.shortDescription || '';
        const highlights = (cs.highlights && cs.highlights.length) ? 
            cs.highlights.map(h => typeof h === 'string' ? h : h.highlightText) : 
            ['Engineered for resilient web traffic and high availability', 'Accessibility and SEO optimization verified'];
        const techs = (cs.technologies && cs.technologies.length) ? 
            cs.technologies.map(t => typeof t === 'string' ? t : t.name) : 
            (project.tags && project.tags.map(t => typeof t === 'string' ? t : t.tagName) || []);
        const liveUrl = cs.liveUrl || project.liveUrl || '';
        const image = cs.heroImageUrl || project.imageUrl || 'assets/img/work/logo (1).png';

        modalContentContainer.innerHTML = `
            <div class="relative w-full h-48 sm:h-64 bg-surface-container-high rounded-xl overflow-hidden mb-6 flex items-center justify-center p-6 border border-border-subtle">
                <img src="${image}" alt="${title}" class="max-h-full max-w-full object-contain drop-shadow-xl" />
                <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent pointer-events-none"></div>
                <span class="absolute top-4 left-4 font-label-badge text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-primary border border-primary/20 backdrop-blur-md">
                    ${category}
                </span>
                <span class="absolute top-4 right-4 font-code-sm text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-secondary border border-secondary/20 backdrop-blur-md">
                    ${year}
                </span>
            </div>

            <div class="flex items-center justify-between gap-4 mb-2">
                <h3 class="font-headline-lg text-xl sm:text-2xl text-text-primary font-bold">${title}</h3>
            </div>
            <div class="font-code-sm text-xs text-primary mb-4 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">verified</span>
                <span>Client: ${client}</span>
            </div>

            <p class="font-body-md text-sm text-text-secondary leading-relaxed mb-6">
                ${summary}
            </p>

            <div class="mb-6">
                <h4 class="font-headline-sm text-sm text-text-primary font-semibold mb-3">Key Highlights & Architecture</h4>
                <ul class="space-y-2">
                    ${highlights.map(f => `
                        <li class="flex items-start gap-2.5 font-body-sm text-sm text-text-secondary">
                            <span class="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                            <span>${f}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="mb-6">
                <h4 class="font-code-sm text-xs text-text-muted uppercase tracking-wider mb-2">Technologies Used</h4>
                <div class="flex flex-wrap gap-2">
                    ${techs.map(s => `
                        <span class="font-label-badge text-xs px-2.5 py-1 rounded-full bg-surface-container text-text-primary border border-border-subtle">${s}</span>
                    `).join('')}
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
                ${liveUrl ? `
                    <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-xs font-semibold flex items-center gap-1.5 hover:bg-primary hover:text-surface transition-all shadow-md">
                        <span>Inspect Live Deployment</span>
                        <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                ` : ''}
                <button type="button" onclick="closeProjectModal()" class="px-4 py-2 rounded-lg bg-surface-container-high text-text-secondary hover:text-text-primary font-headline-sm text-xs transition-colors">
                    Close
                </button>
            </div>
        `;
    } catch (err) {
        modalContentContainer.innerHTML = `
            <div class="p-6 text-center">
                <p class="text-error font-medium mb-3">Could not load case study details.</p>
                <button type="button" onclick="closeProjectModal()" class="px-4 py-2 rounded-lg bg-surface-container-high text-text-primary text-xs">Close</button>
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

// 6. Dynamic Page Hydration Modules

/** Hydrate Contact Details */
async function hydrateContactPage() {
    if (!window.PortfolioApi || !document.getElementById('contact-form')) return;
    try {
        const info = await window.PortfolioApi.getContactInfo();
        if (!info) return;

        if (info.email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
                a.href = `mailto:${info.email}`;
                a.textContent = info.email;
            });
        }
        if (info.phone) {
            document.querySelectorAll('a[href^="tel:"]').forEach(a => {
                a.href = `tel:${info.phone}`;
                a.textContent = info.phoneDisplay || info.phone;
            });
        }
        if (info.whatsappUrl) {
            const wa = document.querySelector('a[href*="wa.me"]');
            if (wa) wa.href = info.whatsappUrl;
        }
        if (info.responseGuarantee) {
            document.querySelectorAll('.font-body-md').forEach(el => {
                if (el.textContent.includes('Guaranteed reply')) {
                    el.textContent = info.responseGuarantee;
                }
            });
        }
        if (info.availabilityText) {
            document.querySelectorAll('.font-label-badge').forEach(b => {
                if (b.textContent.toLowerCase().includes('available')) {
                    b.textContent = info.availabilityText;
                }
            });
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
        if (!data || !data.projects || !data.projects.length) return;

        grid.innerHTML = data.projects.map(p => {
            const categoryClasses = (p.categorySlugs || []).join(' ') + ' all';
            const mainCategory = p.categoryBadgeText || 'Fullstack Project';
            const tags = p.tags || [];
            const tagsHtml = tags.map(t => {
                const name = typeof t === 'string' ? t : t.tagName;
                return `<span class="font-label-badge text-xs px-2.5 py-1 rounded bg-surface-container text-text-primary border border-border-subtle">${name}</span>`;
            }).join('');

            const imageHtml = p.imageUrl ? 
                `<img class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl" src="${p.imageUrl}" alt="${p.imageAlt || p.title}"/>` :
                `<div class="w-16 h-16 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center border border-primary/20"><span class="material-symbols-outlined text-[32px]">${p.iconKey || 'layers'}</span></div>`;

            return `
                <div class="project-item ${categoryClasses} bg-surface-card rounded-2xl overflow-hidden backdrop-blur-xl border border-border-subtle shadow-xl flex flex-col group hover:border-primary/50 transition-all duration-300" data-category="${p.categorySlugs && p.categorySlugs[0] || 'all'}">
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
        console.debug('[Portfolio] Hydration deferred:', e.message);
    }
}

/** Hydrate Articles & Publications Grid */
async function hydrateArticlesPage() {
    const grid = document.getElementById('articles-grid');
    if (!window.PortfolioApi || !grid) return;
    try {
        let articles = await window.PortfolioApi.getArticles();
        if (!articles) return;
        if (articles.value && Array.isArray(articles.value)) articles = articles.value;
        if (!Array.isArray(articles) || !articles.length) return;

        grid.innerHTML = articles.map(a => {
            const tags = a.tags || [];
            const tagsHtml = tags.map(t => {
                const name = typeof t === 'string' ? t : t.tagName;
                return `<span class="font-label-badge text-xs px-2.5 py-1 rounded bg-surface-container text-text-primary border border-border-subtle">${name}</span>`;
            }).join('');

            const dateStr = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Published';
            const readTime = a.readTimeMinutes ? `${a.readTimeMinutes} min read` : '5 min read';
            const image = a.imageUrl || 'assets/img/blog/blog-img1.png';

            return `
                <article class="bg-surface-card rounded-2xl overflow-hidden backdrop-blur-xl border border-border-subtle shadow-xl flex flex-col group hover:border-primary/50 transition-all duration-300">
                    <div class="h-60 overflow-hidden relative bg-surface-container-high">
                        <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${image}" alt="${a.imageAlt || a.title}"/>
                        <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent"></div>
                        <span class="absolute top-4 left-4 font-label-badge text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-primary border border-primary/20 backdrop-blur-md">${a.category || 'Engineering'}</span>
                        <span class="absolute top-4 right-4 font-code-sm text-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 text-text-muted border border-border-subtle backdrop-blur-md">${readTime}</span>
                    </div>
                    <div class="p-7 flex flex-col flex-grow">
                        <div class="flex items-center gap-2 font-code-sm text-xs text-text-muted mb-2">
                            <span>${dateStr}</span>
                            <span>•</span>
                            <span class="text-secondary font-medium">${a.publicationType || 'Software Development Guide'}</span>
                        </div>
                        <h2 class="font-headline-md text-xl text-text-primary font-bold mb-3 group-hover:text-primary transition-colors">
                            ${a.title}
                        </h2>
                        <p class="font-body-md text-sm text-text-secondary mb-6 leading-relaxed">
                            ${a.excerpt || ''}
                        </p>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${tagsHtml}
                        </div>
                        <div class="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-border-subtle">
                            <div class="flex items-center gap-2">
                                ${a.linkedinUrl ? `
                                    <a class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-text-primary hover:bg-primary-container hover:text-on-primary-container font-body-md text-xs font-medium transition-all border border-border-subtle" href="${a.linkedinUrl}" rel="noopener noreferrer" target="_blank">
                                        <span>Read Article</span>
                                        <span class="material-symbols-outlined text-[14px]">arrow_outward</span>
                                    </a>
                                ` : ''}
                                ${a.twitterUrl ? `
                                    <a class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-text-secondary hover:text-text-primary font-code-sm text-xs transition-colors border border-border-subtle" href="${a.twitterUrl}" rel="noopener noreferrer" target="_blank" title="Discussion">
                                        <span>X / Thread</span>
                                    </a>
                                ` : ''}
                            </div>
                            <span class="font-code-sm text-[11px] text-text-muted">${a.footerAnnotation || 'Oluwatobi Adejoro'}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    } catch (e) {
        console.debug('[Articles] Hydration deferred:', e.message);
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
            // Metrics counters
            if (profile.yearsExperience) {
                const expEl = document.getElementById('metric-years-experience');
                if (expEl) expEl.innerHTML = `${profile.yearsExperience}+ <span class="font-code-sm text-xs text-text-secondary font-normal">Years</span>`;
            }
            if (profile.projectsCompleted) {
                const projEl = document.getElementById('metric-projects-completed');
                if (projEl) projEl.innerHTML = `${profile.projectsCompleted}+ <span class="font-code-sm text-xs text-text-secondary font-normal">Projects</span>`;
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

    // Trigger page-specific hydrations
    hydrateContactPage();
    hydratePortfolioPage();
    hydrateArticlesPage();
    hydrateResumePage();
    hydrateHomePage();

    // Modal listeners
    const modalCloseBtn = document.getElementById('case-study-close');
    const modalBackdrop = document.getElementById('case-study-modal');
    if (modalCloseBtn) modalCloseBtn.onclick = closeProjectModal;
    if (modalBackdrop) {
        modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) closeProjectModal();
        };
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
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
