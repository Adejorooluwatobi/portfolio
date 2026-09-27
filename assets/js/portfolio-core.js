/**
 * Portfolio Core JavaScript
 * Oluwatobi Adejoro - Fullstack Software Engineer
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

document.addEventListener('components:ready', initHeaderAndThemeListeners);
document.addEventListener('DOMContentLoaded', () => {
    initHeaderAndThemeListeners();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
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

    // 2. Copy Email Toast Notification
    window.copyEmailToClipboard = function(email = 'Adejorotgold1@yahoo.com') {
        navigator.clipboard.writeText(email).then(() => {
            showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = email;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(`Copied ${email} to clipboard!`);
        });
    };

    function showToast(message) {
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
    }

    // 3. Project Filter Tabs (For portfolio.html)
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-item');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state on buttons
                filterButtons.forEach(b => {
                    b.classList.remove('bg-primary-container', 'text-on-primary-container');
                    b.classList.add('bg-surface-container', 'text-on-surface-variant');
                });
                btn.classList.add('bg-primary-container', 'text-on-primary-container');
                btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter || card.classList.contains(filter)) {
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
                        }, 250);
                    }
                });
            });
        });
    }

    // 4. Contact Form AJAX Submission with Formspree
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const statusBox = document.getElementById('form-status');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Sending message...</span>
                `;
            }

            try {
                const formData = new FormData(contactForm);
                const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject') || 'Contact from Portfolio',
                    message: formData.get('message')
                };
                
                const success = await window.ApiClient.submitContact(contactData);

                if (success) {
                    contactForm.reset();
                    if (statusBox) {
                        statusBox.className = 'p-4 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-body-sm flex items-center gap-3 transition-all';
                        statusBox.innerHTML = `
                            <span class="material-symbols-outlined text-[22px] shrink-0 text-secondary">verified</span>
                            <div>
                                <div class="font-semibold text-text-primary">Message dispatched successfully!</div>
                                <div class="text-text-secondary">Thank you for reaching out. I will review your message and reply within 24 hours.</div>
                            </div>
                        `;
                        statusBox.classList.remove('hidden');
                    }
                    showToast('Message sent! I will reply within 24 hours.');
                } else {
                    throw new Error('API returned an error');
                }
            } catch (err) {
                if (statusBox) {
                    statusBox.className = 'p-4 rounded-xl bg-error/15 text-error border border-error/30 font-body-sm flex items-center gap-3 transition-all';
                    statusBox.innerHTML = `
                        <span class="material-symbols-outlined text-[22px] shrink-0 text-error">error</span>
                        <div>
                            <div class="font-semibold text-text-primary">Failed to send message</div>
                            <div class="text-text-secondary">Please email me directly at <a href="mailto:Adejorotgold1@yahoo.com" class="underline text-primary">Adejorotgold1@yahoo.com</a>.</div>
                        </div>
                    `;
                    statusBox.classList.remove('hidden');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // 5. Project Case Study Modal Logic
    const modalBackdrop = document.getElementById('case-study-modal');
    const modalContentContainer = document.getElementById('case-study-content');
    const modalCloseBtn = document.getElementById('case-study-close');

    let projectData = {};

    async function loadProjectsFromApi() {
        if (!window.ApiClient) return;
        const apiProjects = await window.ApiClient.getProjects();
        if (apiProjects && apiProjects.length > 0) {
            apiProjects.forEach(p => {
                projectData[p.id.toLowerCase()] = {
                    title: p.title,
                    category: p.category || 'Fullstack Application',
                    year: new Date(p.completionDate).getFullYear().toString() || '2024',
                    client: p.clientName || 'Internal Project',
                    summary: p.description,
                    features: p.features ? p.features.split('|') : [],
                    stack: p.technologies ? p.technologies.split(',') : [],
                    liveUrl: p.liveUrl || '#',
                    image: p.imageUrl || 'assets/img/work/placeholder.png'
                };
            });
        }
    }
    loadProjectsFromApi();

    window.openProjectModal = function(projectId) {
        if (!modalBackdrop || !modalContentContainer) return;
        const project = projectData[projectId];
        if (!project) return;

        modalContentContainer.innerHTML = `
            <div class="relative w-full h-48 sm:h-64 bg-surface-container-high rounded-xl overflow-hidden mb-6 flex items-center justify-center p-6 border border-border-subtle">
                <img src="${project.image}" alt="${project.title}" class="max-h-full max-w-full object-contain drop-shadow-xl" />
                <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent pointer-events-none"></div>
                <span class="absolute top-4 left-4 font-label-badge text-label-badge px-3 py-1 rounded-full bg-surface-container-lowest/80 text-primary border border-primary/20 backdrop-blur-md">
                    ${project.category}
                </span>
                <span class="absolute top-4 right-4 font-code-sm text-code-sm px-3 py-1 rounded-full bg-surface-container-lowest/80 text-secondary border border-secondary/20 backdrop-blur-md">
                    ${project.year}
                </span>
            </div>

            <div class="flex items-center justify-between gap-4 mb-3">
                <h3 class="font-headline-lg text-headline-md sm:text-headline-lg text-text-primary">${project.title}</h3>
            </div>
            <div class="font-code-sm text-code-sm text-primary mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">verified</span>
                <span>Client: ${project.client}</span>
            </div>

            <p class="font-body-md text-text-secondary leading-relaxed mb-6">
                ${project.summary}
            </p>

            <div class="mb-6">
                <h4 class="font-headline-sm text-headline-sm text-text-primary mb-3">Key Highlights & Architecture</h4>
                <ul class="space-y-2">
                    ${project.features.map(f => `
                        <li class="flex items-start gap-2.5 font-body-sm text-text-secondary">
                            <span class="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                            <span>${f}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="mb-8">
                <h4 class="font-code-sm text-code-sm text-text-muted uppercase tracking-wider mb-2">Technologies Used</h4>
                <div class="flex flex-wrap gap-2">
                    ${project.stack.map(s => `
                        <span class="font-label-badge text-label-badge px-3 py-1 rounded-full bg-surface-container text-text-primary border border-border-subtle">${s}</span>
                    `).join('')}
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-border-subtle">
                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-headline-sm flex items-center gap-2 hover:bg-surface-tint hover:text-on-primary-fixed transition-colors shadow-lg">
                    <span>Inspect Live Deployment</span>
                    <span class="material-symbols-outlined text-[18px]">arrow_outward</span>
                </a>
                <button type="button" onclick="closeProjectModal()" class="px-5 py-2.5 rounded-lg bg-surface-container-high text-text-secondary hover:text-text-primary hover:bg-surface-container-highest transition-colors font-headline-sm text-headline-sm">
                    Close
                </button>
            </div>
        `;

        modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        modalBackdrop.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';
    };

    window.closeProjectModal = function() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.add('opacity-0', 'pointer-events-none');
        modalBackdrop.classList.remove('opacity-100');
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeProjectModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeProjectModal();
        });
    }
});
