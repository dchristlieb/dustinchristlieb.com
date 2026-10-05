/* ============================================================
   Dustin Christlieb — Portfolio
   All rendering is data-driven; all motion respects
   prefers-reduced-motion.
   ============================================================ */
(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    /* ============================================================
       DATA
       ============================================================ */

    const ROLES = [
        'Google Workspace Architect',
        'Cloud Security Engineer',
        'GAM & Apps Script Automator',
        'IAM & MDM Specialist',
        'Enterprise Productivity Nerd'
    ];

    const TERMINAL_SCRIPT = [
        { cmd: 'whoami', out: [{ text: 'dustin · Sr. Cloud Architect — DoiT Intl.', cls: 'tk-info' }] },
        { cmd: 'gam info domain', out: [
            { text: 'Google Workspace: connected ✓', cls: 'tk-ok' },
            { text: 'security best-practice baseline: loaded ✓', cls: 'tk-dim' }
        ]},
        { cmd: 'clasp push', out: [{ text: 'Apps Script automation deployed ✓', cls: 'tk-ok' }] },
        { cmd: 'gcloud projects get-iam-policy prod', out: [{ text: 'least privilege: verified ✓', cls: 'tk-ok' }] }
    ];

    const MARQUEE_TERMS = [
        'Google Workspace', 'Cloud Security', 'GAM', 'Apps Script', 'IAM', 'GRC', 'MDM',
        'Zero Trust', 'Chrome Enterprise', 'Google Cloud', 'Automation', 'Jamf', 'JumpCloud', 'Cloudflare'
    ];

    const SKILLS = {
        'Cloud & Productivity': {
            icon: 'fas fa-cloud',
            desc: 'Architecture that makes the suite feel invisible — ten thousand little frictions, removed. I design, migrate, and govern Google Workspace and adjacent clouds so people just… work.',
            skills: [
                { name: 'Google Workspace Admin', level: 5 },
                { name: 'Google Cloud Platform', level: 4 },
                { name: 'Chrome Enterprise', level: 5 },
                { name: 'Admin SDK & Policy API', level: 4 },
                { name: 'AWS Fundamentals', level: 3 }
            ]
        },
        'Security & Compliance': {
            icon: 'fas fa-shield-halved',
            desc: 'Security posture is a product feature. I audit, baseline, and harden environments against real-world threats — then make the secure path the easy path.',
            skills: [
                { name: 'Cloud Security Posture', level: 5 },
                { name: 'Zero Trust Architecture', level: 4 },
                { name: 'Security Analytics', level: 4 },
                { name: 'GRC & Auditing', level: 4 },
                { name: 'Access Reviews', level: 5 }
            ]
        },
        'Identity & Endpoint': {
            icon: 'fas fa-fingerprint',
            desc: 'One identity, every device, no drama. From MDM enrollments to SSO rollouts, I build identity fabrics where the right people get in — and everyone else gets logs.',
            skills: [
                { name: 'Identity & Access Mgmt', level: 5 },
                { name: 'Mobile Device Mgmt', level: 5 },
                { name: 'Jamf Pro & Protect', level: 4 },
                { name: 'JumpCloud', level: 4 },
                { name: 'Rippling IAM', level: 4 }
            ]
        },
        'Automation & Code': {
            icon: 'fas fa-terminal',
            desc: 'If it happens twice, it gets scripted. GAM for the heavy lifting, Apps Script for the glue, Workers at the edge — thousands of admin hours returned to their owners.',
            skills: [
                { name: 'GAM / GAMADV-XTD3', level: 5 },
                { name: 'Apps Script & clasp', level: 5 },
                { name: 'JavaScript', level: 4 },
                { name: 'Cloudflare Workers', level: 4 },
                { name: 'Jekyll & Static Sites', level: 4 }
            ]
        }
    };

    const SOCIALS = [
        { label: 'LinkedIn', handle: 'in/dustinchristlieb', url: 'https://www.linkedin.com/in/dustinchristlieb', icon: 'fa-brands fa-linkedin-in', hero: true },
        { label: 'GitHub', handle: '@dchristlieb', url: 'https://github.com/dchristlieb', icon: 'fa-brands fa-github', hero: true },
        { label: 'Blog · Medium', handle: '@dustinchristlieb', url: 'https://medium.com/@dustinchristlieb', icon: 'fa-brands fa-medium', hero: true },
        { label: 'Google Developer', handle: 'g.dev/dchristlieb', url: 'https://g.dev/dchristlieb', icon: 'fa-brands fa-google', hero: true },
        { label: 'Google Help', handle: 'Community Profile', url: 'https://support.google.com/profile/161318794', icon: 'fas fa-circle-question', hero: false },
        { label: 'Instagram', handle: '@profanitystar', url: 'https://www.instagram.com/profanitystar/', icon: 'fa-brands fa-instagram', hero: false },
        { label: 'Travel Blog', handle: '@travelblogdc', url: 'https://www.instagram.com/travelblogdc/', icon: 'fas fa-route', hero: false },
        { label: 'Hotel Carpet Blog', handle: '@hotelcarpetblog', url: 'https://www.instagram.com/hotelcarpetblog/', icon: 'fas fa-camera', hero: false },
        { label: 'Steam', handle: 'ProfanityStar', url: 'https://steamcommunity.com/id/ProfanityStar/', icon: 'fa-brands fa-steam', hero: false }
    ];

    const VENDOR_SHORT = {
        'Amazon Web Services (AWS)': 'AWS',
        'Rippling University': 'Rippling'
    };

    /* ============================================================
       THEME
       ============================================================ */
    const themeToggle = $('#themeToggle');
    const metaTheme = $('meta[name="theme-color"]');

    function applyThemeMeta() {
        const dark = document.documentElement.getAttribute('data-theme') !== 'light';
        if (metaTheme) metaTheme.setAttribute('content', dark ? '#0a0f16' : '#f5f8fb');
    }
    function toggleTheme() {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('dc-theme', next); } catch (e) {}
        applyThemeMeta();
    }
    themeToggle && themeToggle.addEventListener('click', toggleTheme);
    applyThemeMeta();

    // Platform hint for palette shortcut
    if (/Mac|iPhone|iPad/.test(navigator.platform || '')) {
        const hint = $('#paletteModHint');
        if (hint) hint.textContent = '⌘';
    }

    /* ============================================================
       NAV: scrolled state, mobile drawer, scrollspy
       ============================================================ */
    const navbar = $('#navbar');
    const navToggle = $('.nav-toggle');
    const navMenu = $('#nav-menu');

    function onNavScroll() {
        navbar && navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    function closeMobileNav() {
        if (!navMenu || !navMenu.classList.contains('open')) return;
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) closeMobileNav();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });
        window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMobileNav(); });
    }

    // Scrollspy
    const navLinks = $$('.nav-link').filter(l => l.getAttribute('href') && l.getAttribute('href').startsWith('#'));
    const spyTargets = navLinks
        .map(l => ({ link: l, section: $(l.getAttribute('href')) }))
        .filter(x => x.section);
    if ('IntersectionObserver' in window && spyTargets.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                spyTargets.forEach(({ link }) => link.classList.remove('active'));
                const active = spyTargets.find(t => t.section === entry.target);
                if (active) active.link.classList.add('active');
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
        spyTargets.forEach(({ section }) => spy.observe(section));
    }

    /* ============================================================
       SCROLL PROGRESS + SCROLL-TO-TOP
       ============================================================ */
    const progressBar = $('#scrollProgressBar');
    const toTop = $('#scrollToTop');

    function onScroll() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) progressBar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
        if (toTop) toTop.classList.toggle('visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    function scrollTop() { window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }); }
    toTop && toTop.addEventListener('click', scrollTop);
    const footerTop = $('#footerTop');
    footerTop && footerTop.addEventListener('click', scrollTop);

    /* ============================================================
       REVEAL ON SCROLL (staggered per parent container)
       ============================================================ */
    const revealEls = $$('.reveal');
    const siblingIndex = new Map();
    revealEls.forEach(el => {
        const parent = el.parentElement;
        const i = siblingIndex.get(parent) || 0;
        siblingIndex.set(parent, i + 1);
        el.style.setProperty('--reveal-delay', Math.min(i * 0.08, 0.48) + 's');
    });
    if ('IntersectionObserver' in window && !prefersReduced) {
        const ro = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    ro.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        revealEls.forEach(el => ro.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* ============================================================
       HERO: typewriter of specialties
       ============================================================ */
    const typeEl = $('#typewriter');
    if (typeEl) {
        if (prefersReduced) {
            typeEl.textContent = ROLES[0];
        } else {
            let roleIdx = 0, charIdx = 0, deleting = false;
            (function tick() {
                const role = ROLES[roleIdx];
                if (!deleting) {
                    charIdx++;
                    typeEl.textContent = role.slice(0, charIdx);
                    if (charIdx === role.length) { deleting = true; return setTimeout(tick, 1900); }
                    return setTimeout(tick, 55 + Math.random() * 45);
                }
                charIdx--;
                typeEl.textContent = role.slice(0, charIdx);
                if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % ROLES.length; return setTimeout(tick, 420); }
                return setTimeout(tick, 30);
            })();
        }
    }

    /* ============================================================
       HERO: terminal demo loop
       ============================================================ */
    const termOut = $('#terminalOut');
    if (termOut) {
        const PROMPT = '➜ ~ ';
        if (prefersReduced) {
            let html = '';
            TERMINAL_SCRIPT.forEach(step => {
                html += '<span class="tk-prompt">' + PROMPT + '</span><span class="tk-cmd">' + escapeHtml(step.cmd) + '</span>\n';
                step.out.forEach(l => { html += '<span class="' + l.cls + '">' + escapeHtml(l.text) + '</span>\n'; });
            });
            termOut.innerHTML = html.trim();
        } else {
            const typeText = (text, cls) => new Promise(resolve => appendTyped(termOut, text, cls, resolve));
            function appendTyped(node, text, cls, done) {
                const span = document.createElement('span');
                if (cls) span.className = cls;
                node.appendChild(span);
                let i = 0;
                (function step() {
                    i++;
                    span.textContent = text.slice(0, i);
                    if (i >= text.length) return done();
                    setTimeout(step, 34 + Math.random() * 34);
                })();
            }
            // Keep the terminal a fixed window: drop the oldest lines as new ones land
            function trimTerm(maxLines) {
                let newlines = 0;
                termOut.childNodes.forEach(n => {
                    if (n.nodeType === 3 && n.textContent === '\n') newlines++;
                });
                let toRemove = newlines - maxLines;
                while (toRemove > 0 && termOut.firstChild) {
                    const n = termOut.firstChild;
                    if (n.nodeType === 3 && n.textContent === '\n') toRemove--;
                    termOut.removeChild(n);
                }
            }
            const printLine = (text, cls) => {
                const span = document.createElement('span');
                if (cls) span.className = cls;
                span.textContent = text;
                termOut.appendChild(span);
                termOut.appendChild(document.createTextNode('\n'));
                trimTerm(6); // +1 in-progress line = 7 visible max
            };
            const wait = ms => new Promise(r => setTimeout(r, ms));
            (async function loop() {
                for (;;) {
                    termOut.innerHTML = '';
                    for (const step of TERMINAL_SCRIPT) {
                        printInlinePrompt(termOut, PROMPT);
                        await typeText(step.cmd, 'tk-cmd');
                        termOut.appendChild(document.createTextNode('\n'));
                        await wait(260);
                        for (const line of step.out) { printLine(line.text, line.cls); await wait(140); }
                        await wait(760);
                    }
                    await wait(3400);
                }
            })();
        }
    }
    function printInlinePrompt(node, prompt) {
        const span = document.createElement('span');
        span.className = 'tk-prompt';
        span.textContent = prompt;
        node.appendChild(span);
    }
    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ============================================================
       HERO: cursor glow
       ============================================================ */
    const glow = $('#cursorGlow');
    const hero = $('#home');
    if (glow && hero && finePointer && !prefersReduced) {
        hero.addEventListener('pointermove', (e) => {
            const rect = hero.getBoundingClientRect();
            glow.style.left = (e.clientX - rect.left) + 'px';
            glow.style.top = (e.clientY - rect.top) + 'px';
        }, { passive: true });
    }

    /* ============================================================
       STAT COUNTERS (targets set dynamically)
       ============================================================ */
    const statEls = {};
    $$('.count[data-stat]').forEach(el => { statEls[el.dataset.stat] = el; });
    const statTargets = {};
    let statsStarted = false;
    let statsVisible = false;

    const heroStatsEl = $('#heroStats');
    if (heroStatsEl && 'IntersectionObserver' in window) {
        const so = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                statsVisible = true;
                so.disconnect();
                maybeRunStats();
            }
        }, { threshold: 0.25 });
        so.observe(heroStatsEl);
    } else {
        statsVisible = true;
    }

    function setStat(key, value) {
        statTargets[key] = value;
        maybeRunStats();
    }
    function maybeRunStats() {
        if (statsStarted || !statsVisible) return;
        if (Object.keys(statTargets).length < Object.keys(statEls).length) return;
        statsStarted = true;
        Object.keys(statEls).forEach(key => animateCount(statEls[key], statTargets[key]));
    }
    function animateCount(el, target) {
        if (prefersReduced) { el.textContent = target; return; }
        const dur = 1500, t0 = performance.now();
        (function frame(now) {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(frame);
        })(t0);
    }

    // Stats known immediately from local data
    setStat('domains', Object.keys(SKILLS).length);
    setStat('projects', $$('.project-card').length);

    /* ============================================================
       MARQUEE
       ============================================================ */
    const marqueeTrack = $('#marqueeTrack');
    if (marqueeTrack) {
        let html = '';
        // Duplicate content for a seamless loop (track translates -50%)
        for (let r = 0; r < 2; r++) {
            MARQUEE_TERMS.forEach(term => { html += '<span class="marquee-item">' + escapeHtml(term) + '</span>'; });
        }
        marqueeTrack.innerHTML = html;
    }

    /* ============================================================
       SOCIALS (hero row + connect grid)
       ============================================================ */
    const heroSocials = $('#heroSocials');
    if (heroSocials) {
        SOCIALS.filter(s => s.hero).forEach(s => {
            const a = document.createElement('a');
            a.href = s.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', s.label + ' — ' + s.handle + ' (opens in a new tab)');
            a.innerHTML = '<i class="' + s.icon + '" aria-hidden="true"></i>';
            heroSocials.appendChild(a);
        });
    }
    const socialGrid = $('#socialGrid');
    if (socialGrid) {
        SOCIALS.forEach(s => {
            const a = document.createElement('a');
            a.className = 'social-card';
            a.href = s.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.innerHTML =
                '<span class="social-icon"><i class="' + s.icon + '" aria-hidden="true"></i></span>' +
                '<span class="social-meta">' +
                    '<span class="social-label">' + escapeHtml(s.label) + '</span>' +
                    '<span class="social-handle">' + escapeHtml(s.handle) + '</span>' +
                '</span>' +
                '<i class="fas fa-arrow-up-right-from-square social-arrow" aria-hidden="true"></i>';
            socialGrid.appendChild(a);
        });
    }

    /* ============================================================
       EXPERTISE TABS
       ============================================================ */
    const tabsWrap = $('#expertiseTabs');
    const panel = $('#expertisePanel');
    if (tabsWrap && panel) {
        const domains = Object.keys(SKILLS);
        domains.forEach((domain, idx) => {
            const btn = document.createElement('button');
            btn.className = 'expertise-tab';
            btn.id = 'tab-' + idx;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', String(idx === 0));
            btn.setAttribute('aria-controls', 'expertisePanel');
            btn.innerHTML = '<i class="' + SKILLS[domain].icon + '" aria-hidden="true"></i>' + escapeHtml(domain);
            btn.addEventListener('click', () => selectDomain(idx));
            tabsWrap.appendChild(btn);
        });

        function selectDomain(idx) {
            $$('.expertise-tab', tabsWrap).forEach((b, i) => b.setAttribute('aria-selected', String(i === idx)));
            renderDomain(domains[idx]);
        }

        function renderDomain(domain) {
            const data = SKILLS[domain];
            panel.innerHTML = '';
            const desc = document.createElement('p');
            desc.className = 'expertise-desc expertise-item-in';
            desc.textContent = data.desc;
            panel.appendChild(desc);

            const wrap = document.createElement('div');
            wrap.className = 'skill-wrap';
            data.skills.forEach((skill, i) => {
                const chip = document.createElement('span');
                chip.className = 'skill-chip expertise-item-in';
                chip.style.animationDelay = (i * 0.05) + 's';
                chip.title = skill.name + ' — proficiency ' + skill.level + '/5';
                let dots = '';
                for (let d = 1; d <= 5; d++) dots += '<i class="' + (d <= skill.level ? 'on' : '') + '"></i>';
                chip.innerHTML = escapeHtml(skill.name) + '<span class="skill-dots" aria-hidden="true">' + dots + '</span>' +
                    '<span class="sr-only"> (proficiency ' + skill.level + ' of 5)</span>';
                wrap.appendChild(chip);
            });
            panel.appendChild(wrap);
        }

        renderDomain(domains[0]);
    }

    /* ============================================================
       CERTIFICATIONS (fetched, filterable, animated)
       ============================================================ */
    const certGrid = $('#certGrid');
    const vendorFilter = $('#vendorFilter');
    let allCerts = [];
    let activeVendor = null; // null === All

    function vendorLabel(v) { return VENDOR_SHORT[v] || v; }

    function renderVendorPills() {
        if (!vendorFilter) return;
        const counts = new Map();
        allCerts.forEach(c => counts.set(c.issuer, (counts.get(c.issuer) || 0) + 1));
        const vendors = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

        vendorFilter.innerHTML = '';
        const mk = (label, key, count, active) => {
            const b = document.createElement('button');
            b.className = 'filter-btn' + (active ? ' active' : '');
            b.type = 'button';
            b.dataset.vendor = key;
            b.setAttribute('aria-pressed', String(active));
            b.innerHTML = escapeHtml(label) + ' <span class="filter-count">' + count + '</span>';
            b.addEventListener('click', () => {
                activeVendor = key === '' ? null : key;
                $$('.filter-btn', vendorFilter).forEach(x => {
                    const on = x.dataset.vendor === key;
                    x.classList.toggle('active', on);
                    x.setAttribute('aria-pressed', String(on));
                });
                renderCerts(true);
            });
            return b;
        };
        vendorFilter.appendChild(mk('All vendors', '', allCerts.length, activeVendor === null));
        vendors.forEach(([v, n]) => vendorFilter.appendChild(mk(vendorLabel(v), v, n, activeVendor === v)));
    }

    function renderCerts(animate) {
        if (!certGrid) return;
        const list = activeVendor === null ? allCerts : allCerts.filter(c => c.issuer === activeVendor);
        certGrid.innerHTML = '';
        list.forEach((cert, i) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'cert-card' + (animate ? ' expertise-item-in' : '');
            if (animate) a.style.animationDelay = Math.min(i * 0.04, 0.6) + 's';
            a.href = cert.verifyLink;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', cert.name + ' — ' + vendorLabel(cert.issuer) + ' (verify, opens in a new tab)');
            a.innerHTML =
                '<span class="cert-head">' +
                    '<img class="cert-logo' + (cert.isSquareLogo ? ' square-logo' : '') + '" src="' + cert.logo + '" alt="" loading="lazy" width="46" height="46">' +
                    '<span class="cert-issuer">' + escapeHtml(vendorLabel(cert.issuer)) + '</span>' +
                '</span>' +
                '<span class="cert-name">' + escapeHtml(cert.name) + '</span>' +
                '<span class="cert-verify">Verify credential <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></span>';
            li.appendChild(a);
            certGrid.appendChild(li);
        });
    }

    if (certGrid) {
        fetch('certifications.json')
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(data => {
                allCerts = data;
                renderVendorPills();
                renderCerts(false);
                setStat('certs', data.length);
                const vendors = new Set(data.map(c => c.issuer)).size;
                setStat('vendors', vendors);
                const summary = $('#certSummary');
                if (summary) {
                    summary.textContent = data.length + ' verified credentials across ' + vendors +
                        ' vendors — cloud, security, identity, and endpoint management. Click any card to verify it at the source.';
                }
                const certCount = $('#expertiseCertCount');
                if (certCount) certCount.textContent = data.length;
            })
            .catch(err => {
                console.error('Error loading certifications:', err);
                setStat('certs', 19);
                setStat('vendors', 7);
            });
    } else {
        setStat('certs', 19);
        setStat('vendors', 7);
    }

    /* ============================================================
       ASSOCIATIONS (hidden unless data exists — preserved behavior)
       ============================================================ */
    fetch('associations.json')
        .then(r => (r.ok ? r.json() : []))
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) return;
            const section = $('#associations');
            const navLink = $('a[href="#associations"]');
            const list = $('.associations-list');
            if (!section || !list) return;
            section.hidden = false;
            if (navLink) navLink.hidden = false;
            data.forEach(assoc => {
                const li = document.createElement('li');
                li.innerHTML =
                    '<strong>' + escapeHtml(assoc.name || '') + '</strong>' +
                    '<span class="association-role">' + escapeHtml(assoc.role || '') + '</span>' +
                    '<span class="association-date">' + escapeHtml(assoc.date || '') + '</span>';
                list.appendChild(li);
            });
        })
        .catch(() => {}); // Optional content — fail silently

    /* ============================================================
       MICRO-INTERACTIONS: magnetic buttons + 3D tilt
       ============================================================ */
    if (finePointer && !prefersReduced) {
        $$('[data-magnetic]').forEach(el => {
            let raf = null;
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) / r.width;
                const y = (e.clientY - r.top - r.height / 2) / r.height;
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    el.style.transform = 'translate(' + (x * 6) + 'px,' + (y * 5 - 2) + 'px)';
                });
            });
            el.addEventListener('pointerleave', () => {
                cancelAnimationFrame(raf);
                el.style.transform = '';
            });
        });

        $$('[data-tilt]').forEach(el => {
            let raf = null;
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    el.style.transform = 'perspective(900px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 9) + 'deg) translateY(-2px)';
                });
            });
            el.addEventListener('pointerleave', () => {
                cancelAnimationFrame(raf);
                el.style.transform = '';
            });
        });
    }

    /* ============================================================
       COMMAND PALETTE  (Ctrl/Cmd + K)
       ============================================================ */
    const overlay = $('#paletteOverlay');
    const input = $('#paletteInput');
    const listEl = $('#paletteList');
    const trigger = $('#paletteTrigger');
    let paletteItems = [];
    let filtered = [];
    let activeIdx = 0;
    let lastFocus = null;

    function buildPaletteItems() {
        const sections = [
            { label: 'Home', hint: '#home', icon: 'fas fa-house' },
            { label: 'About', hint: '#about', icon: 'fas fa-user' },
            { label: 'Expertise', hint: '#expertise', icon: 'fas fa-layer-group' },
            { label: 'Projects', hint: '#projects', icon: 'fas fa-code' },
            { label: 'Credentials', hint: '#credentials', icon: 'fas fa-certificate' },
            { label: 'Connect', hint: '#connect', icon: 'fas fa-envelope' }
        ].map(s => ({
            label: 'Go to ' + s.label, hint: s.hint, icon: s.icon, keywords: s.label.toLowerCase(),
            run() { const t = $(s.hint); if (t) t.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' }); }
        }));

        const dark = document.documentElement.getAttribute('data-theme') !== 'light';
        const themeItem = {
            label: dark ? 'Switch to light theme' : 'Switch to dark theme',
            hint: 'theme', icon: 'fas fa-circle-half-stroke', keywords: 'theme dark light mode color',
            run() { toggleTheme(); }
        };
        const topItem = {
            label: 'Back to top', hint: '↑', icon: 'fas fa-arrow-up', keywords: 'top scroll home',
            run: scrollTop
        };
        const externals = SOCIALS.filter(s => s.hero).map(s => ({
            label: 'Open ' + s.label, hint: '↗', icon: s.icon, keywords: s.label.toLowerCase() + ' profile link',
            run() { window.open(s.url, '_blank', 'noopener'); }
        }));

        paletteItems = [...sections, themeItem, topItem, ...externals];
    }

    function renderPalette() {
        if (!listEl) return;
        listEl.innerHTML = '';
        if (filtered.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'palette-empty';
            empty.textContent = 'No matches — try “projects”, “theme”, or “github”.';
            listEl.appendChild(empty);
            return;
        }
        filtered.forEach((item, i) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'palette-item' + (i === activeIdx ? ' active' : '');
            btn.setAttribute('role', 'option');
            btn.setAttribute('aria-selected', String(i === activeIdx));
            btn.innerHTML =
                '<span class="p-icon"><i class="' + item.icon + '" aria-hidden="true"></i></span>' +
                '<span class="p-label">' + escapeHtml(item.label) + '</span>' +
                '<span class="p-hint">' + escapeHtml(item.hint) + '</span>';
            btn.addEventListener('click', () => executeItem(i));
            btn.addEventListener('pointermove', () => setActive(i, false));
            li.appendChild(btn);
            listEl.appendChild(li);
        });
    }

    function setActive(i, scroll) {
        activeIdx = Math.max(0, Math.min(i, filtered.length - 1));
        $$('.palette-item', listEl).forEach((el, j) => {
            el.classList.toggle('active', j === activeIdx);
            el.setAttribute('aria-selected', String(j === activeIdx));
        });
        if (scroll !== false) {
            const active = $$('.palette-item', listEl)[activeIdx];
            active && active.scrollIntoView({ block: 'nearest' });
        }
    }

    function filterPalette(q) {
        q = q.trim().toLowerCase();
        filtered = !q ? paletteItems.slice() : paletteItems.filter(it =>
            it.label.toLowerCase().includes(q) || (it.keywords && it.keywords.includes(q)));
        activeIdx = 0;
        renderPalette();
    }

    function executeItem(i) {
        const item = filtered[i];
        closePalette();
        if (item) item.run();
    }

    function openPalette() {
        buildPaletteItems();
        lastFocus = document.activeElement;
        overlay.hidden = false;
        input.value = '';
        filterPalette('');
        requestAnimationFrame(() => input.focus());
        document.body.style.overflow = 'hidden';
    }

    function closePalette() {
        if (!overlay || overlay.hidden) return;
        overlay.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (overlay && input && trigger) {
        trigger.addEventListener('click', openPalette);
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                overlay.hidden ? openPalette() : closePalette();
            }
        });
        overlay.addEventListener('pointerdown', (e) => { if (e.target === overlay) closePalette(); });
        input.addEventListener('input', () => filterPalette(input.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1 > filtered.length - 1 ? 0 : activeIdx + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIdx - 1 < 0 ? filtered.length - 1 : activeIdx - 1); }
            else if (e.key === 'Enter') { e.preventDefault(); executeItem(activeIdx); }
            else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
        });
    }

    /* ============================================================
       MISC
       ============================================================ */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
