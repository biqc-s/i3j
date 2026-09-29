/* ════════════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — Saeed Ahmad Jahash
   Renders every section from data/profile.js + data/ui.js, then wires up:
   language toggle (EN/AR), typewriter, reveal animations, custom cursor,
   mobile menu, active nav, header/progress, CV download menu, JSON-LD.
════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const { t, num, esc, plain, visible, formatRange, detectLang, saveLang } = window.Core;
    const P  = window.PROFILE;
    const UI = window.UI;

    const $  = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let lang = detectLang();

    /* ════════════════════════════════════════════════════════
       RENDERING
    ════════════════════════════════════════════════════════ */

    const SECTION_ORDER = ['about', 'experience', 'projects', 'skills', 'education'];
    const revealed = new Set(); // keys of .anim elements already shown — survives language switches

    const icon = (name, extra = '') => `<i class="fas ${esc(name)} ${extra}" aria-hidden="true"></i>`;

    function anim(key) {
        return `anim${revealed.has(key) ? ' visible' : ''}" data-anim="${key}`;
    }

    function sectionHeader(key) {
        const s = UI.sections[key];
        const n = num(String(SECTION_ORDER.indexOf(key) + 1).padStart(2, '0'), lang);
        const [plainPart, goldPart] = s.title;
        return `
        <div class="section-header">
            <span class="section-tag">${n} — ${esc(t(s.tag, lang))}</span>
            <h2 class="section-title">${esc(t(plainPart, lang))}<span class="gold">${esc(t(goldPart, lang))}</span></h2>
        </div>`;
    }

    const wrap = (key, inner) => `<div class="container">${sectionHeader(key)}${inner}</div>`;

    const renderers = {
        about() {
            const paragraphs = (P.about || []).map(p => `<p>${t(p, lang)}</p>`).join('');
            const highlights = visible(P.highlights, 'site').map(h => `
                <div class="hl-card">
                    <div class="hl-icon">${icon(h.icon)}</div>
                    <div class="hl-body">
                        <h3>${esc(t(h.title, lang))}</h3>
                        <p>${esc(t(h.text, lang))}</p>
                    </div>
                </div>`).join('');
            return wrap('about', `
                <div class="about-grid">
                    <div class="about-text ${anim('about-text')}">${paragraphs}</div>
                    <div class="about-highlights ${anim('about-hl')}">${highlights}</div>
                </div>`);
        },

        experience() {
            const present = t(UI.labels.present, lang);
            const items = visible(P.experience, 'site').map((job, i) => {
                const org = [t(job.org, lang), t(job.location, lang)].filter(Boolean).join(lang === 'ar' ? '، ' : ', ');
                const current = !job.end;
                return `
                <article class="tl-item ${anim('exp-' + i)}">
                    <div class="tl-marker">
                        <div class="tl-icon${current ? ' tl-icon-current' : ''}">${icon(job.icon || 'fa-briefcase')}</div>
                        <div class="tl-line"></div>
                    </div>
                    <div class="tl-card glass-card">
                        <div class="tl-meta">
                            <span class="tl-date">${esc(num(formatRange(job.start, job.end, lang, present), lang))}</span>
                            ${job.tag ? `<span class="tl-badge">${esc(t(job.tag, lang))}</span>` : ''}
                        </div>
                        <h3>${esc(t(job.role, lang))}</h3>
                        <h4>${esc(org)}</h4>
                        <ul>${visible(job.points, 'site').map(pt => `<li>${t(pt, lang)}</li>`).join('')}</ul>
                    </div>
                </article>`;
            }).join('');
            return wrap('experience', `<div class="timeline">${items}</div>`);
        },

        projects() {
            const cards = visible(P.projects, 'site').map((pr, i) => {
                const tags = (pr.tags || []).map(tag => `<span>${esc(t(tag, lang))}</span>`).join('');
                const award = pr.award ? `<span class="tag-award">🏆 ${esc(t(pr.award, lang))}</span>` : '';
                const link = pr.url ? `<a class="proj-link" href="${esc(pr.url)}" target="_blank" rel="noopener" aria-label="${esc(t(pr.title, lang))}">${icon('fa-arrow-up-right-from-square')}</a>` : '';
                return `
                <article class="proj-card glass-card ${pr.featured ? 'proj-featured ' : ''}${anim('proj-' + i)}">
                    <span class="proj-num" aria-hidden="true">${num(String(i + 1).padStart(2, '0'), lang)}</span>
                    <div class="proj-icon">${icon(pr.icon || 'fa-cube')}</div>
                    <h3>${esc(t(pr.title, lang))}</h3>
                    <p>${t(pr.description, lang)}</p>
                    <div class="proj-tags">${tags}${award}</div>
                    ${link}
                </article>`;
            }).join('');
            return wrap('projects', `<div class="projects-grid">${cards}</div>`);
        },

        skills() {
            const comps = visible(P.competencies, 'site').map(c => `
                <li class="comp-item"><div class="comp-icon">${icon(c.icon)}</div><span>${esc(t(c.name, lang))}</span></li>`).join('');
            const certs = visible(P.certifications, 'site').map(c => `
                <li class="cert-item">
                    <div class="cert-badge">${icon(c.icon || 'fa-certificate')}</div>
                    <div class="cert-body">
                        <span class="cert-name">${esc(t(c.name, lang))}</span>
                        <span class="cert-from">${esc(t(c.issuer, lang))}${c.year ? ' · ' + num(c.year, lang) : ''}</span>
                    </div>
                </li>`).join('');
            return wrap('skills', `
                <div class="skills-layout">
                    <div class="skills-competencies ${anim('skills-comp')}">
                        <h3 class="skills-cat-title">${esc(t(UI.labels.competencies, lang))}</h3>
                        <ul class="competency-grid">${comps}</ul>
                    </div>
                    <div class="skills-certs ${anim('skills-certs')}">
                        <h3 class="skills-cat-title">${esc(t(UI.labels.certifications, lang))}</h3>
                        <ul class="cert-list">${certs}</ul>
                    </div>
                </div>`);
        },

        education() {
            const cards = visible(P.education, 'site').map((ed, i) => {
                const status = ed.inProgress
                    ? `<span class="edu-status status-progress">${esc(t(UI.labels.inProgress, lang))}</span>`
                    : ed.year ? `<span class="edu-status">${esc(t(UI.labels.classOf, lang))} ${num(ed.year, lang)}</span>` : '';
                return `
                <article class="edu-card glass-card ${anim('edu-' + i)}">
                    <div class="edu-icon">${icon(ed.icon || 'fa-graduation-cap')}</div>
                    ${status}
                    <h3>${esc(t(ed.degree, lang))}</h3>
                    <p>${esc(t(ed.school, lang))}</p>
                </article>`;
            }).join('');
            return wrap('education', `<div class="edu-grid">${cards}</div>`);
        }
    };

    function renderNav() {
        const links = Object.keys(UI.nav).map(key => {
            const cls = key === 'contact' ? ' class="btn-nav"' : '';
            return `<li><a href="#${key}"${cls}>${esc(t(UI.nav[key], lang))}</a></li>`;
        }).join('');
        $('#navLinks').innerHTML = links;
    }

    function renderHero() {
        const [first, middle, last] = t(P.person.nameLines, lang) || [];
        $('#heroName').innerHTML = `
            <span class="name-line-1">${esc(first || '')}</span>
            <span class="name-line-2">${esc(middle || '')} <em class="name-accent">${esc(last || '')}</em></span>`;
        $('#heroName').setAttribute('aria-label', t(P.person.name, lang));

        $('#heroAvailable').hidden = P.person.available === false;
        $('#avatarInitials').textContent = P.person.initials || '';

        const autoValue = {
            projects:       () => visible(P.projects, 'site').length,
            certifications: () => visible(P.certifications, 'site').length,
            experience:     () => visible(P.experience, 'site').length,
            years:          () => {
                const starts = (P.experience || []).map(j => j.start).filter(Boolean).sort();
                if (!starts.length) return 0;
                const [y, m] = starts[0].split('-').map(Number);
                const now = new Date();
                return Math.max(0, Math.floor(((now.getFullYear() - y) * 12 + (now.getMonth() + 1 - (m || 1))) / 12));
            }
        };
        $('#heroStats').innerHTML = (P.stats || []).map((s, i) => {
            const raw = s.auto && autoValue[s.auto] ? autoValue[s.auto]() : s.value;
            return `${i ? '<div class="stat-sep" aria-hidden="true"></div>' : ''}
                <div class="hero-stat">
                    <span class="stat-num">${esc(num(raw, lang))}${esc(s.suffix || '')}</span>
                    <span class="stat-lbl">${esc(t(s.label, lang))}</span>
                </div>`;
        }).join('');

        const positions = ['badge-pmp', 'badge-iso', 'badge-ai'];
        $('#heroBadges').innerHTML = (P.badges || []).slice(0, 3).map((b, i) =>
            `<div class="float-badge ${positions[i]}">${icon(b.icon)}<span>${esc(t(b.text, lang))}</span></div>`
        ).join('');
    }

    function renderFooter() {
        const [a, b] = UI.contact.title;
        $('#contactTitle').innerHTML = `${esc(t(a, lang))}<span class="gold">${esc(t(b, lang))}</span>`;

        const p = P.person;
        const items = [];
        if (p.email) items.push({ href: `mailto:${p.email}`, icon: 'fas fa-envelope', label: t(UI.labels.email, lang), value: p.email, ltr: true });
        if (p.phone) items.push({ href: `tel:${p.phone}`, icon: 'fas fa-phone', label: t(UI.labels.phone, lang), value: p.phoneDisplay || p.phone, ltr: true });
        if (p.linkedin) items.push({ href: p.linkedin, icon: 'fab fa-linkedin', label: 'LinkedIn', value: t(UI.labels.viewProfile, lang), external: true });

        $('#footerContacts').innerHTML = items.map(it => `
            <a href="${esc(it.href)}" class="footer-contact-item"${it.external ? ' target="_blank" rel="noopener"' : ''}>
                <div class="fc-icon"><i class="${it.icon}" aria-hidden="true"></i></div>
                <div class="fc-body">
                    <span class="fc-label">${esc(it.label)}</span>
                    <span class="fc-value"${it.ltr ? ' dir="ltr"' : ''}>${esc(it.value)}</span>
                </div>
            </a>`).join('');

        $('#year').textContent = num(new Date().getFullYear(), lang);
        $('#copyName').textContent = t(P.person.name, lang);
    }

    function renderCvMenus() {
        const m = UI.cvMenu;
        $$('[data-cv-menu]').forEach((host, i) => {
            const id = 'cvMenu' + i;
            const compact = host.hasAttribute('data-compact');
            host.classList.toggle('cv-dropdown-up', host.hasAttribute('data-up'));
            host.innerHTML = `
                <button type="button" class="btn-cv${compact ? ' btn-cv-compact' : ''}" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}">
                    ${icon('fa-file-arrow-down')}<span class="btn-cv-label">${esc(t(m.button, lang))}</span>
                </button>
                <div class="cv-menu" id="${id}" role="menu" hidden>
                    <p class="cv-menu-heading">${esc(t(m.heading, lang))}</p>
                    <button type="button" role="menuitem" data-cv-lang="en" lang="en">
                        <span class="cv-menu-flag">EN</span><span>${esc(t(m.english, lang))}</span>
                    </button>
                    <button type="button" role="menuitem" data-cv-lang="ar" lang="ar">
                        <span class="cv-menu-flag">ع</span><span>${esc(t(m.arabic, lang))}</span>
                    </button>
                    <a role="menuitem" href="cv.html?lang=${lang}" class="cv-menu-preview">
                        ${icon('fa-eye')}<span>${esc(t(m.preview, lang))}</span>
                    </a>
                    <p class="cv-menu-hint">${esc(t(m.hint, lang))}</p>
                </div>`;
        });
    }

    function applyStaticI18n() {
        const get = path => path.split('.').reduce((o, k) => (o ? o[k] : undefined), UI);
        $$('[data-i18n]').forEach(el => {
            const val = get(el.getAttribute('data-i18n'));
            if (val) el.textContent = t(val, lang);
        });
        $$('[data-i18n-aria]').forEach(el => {
            const val = get(el.getAttribute('data-i18n-aria'));
            if (val) el.setAttribute('aria-label', t(val, lang));
        });
    }

    function renderMeta() {
        const isAr = lang === 'ar';
        document.documentElement.lang = lang;
        document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
        document.title = t(UI.meta.title, lang);
        const desc = t(UI.meta.description, lang);
        $('meta[name="description"]')?.setAttribute('content', desc);
        $('meta[property="og:title"]')?.setAttribute('content', document.title);
        $('meta[property="og:description"]')?.setAttribute('content', desc);
        $('meta[property="og:locale"]')?.setAttribute('content', isAr ? 'ar_SA' : 'en_US');
        $('meta[property="og:locale:alternate"]')?.setAttribute('content', isAr ? 'en_US' : 'ar_SA');
        $('#langToggle').classList.toggle('ar-active', isAr);
    }

    function renderJsonLd() {
        const p = P.person;
        const data = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: t(p.name, 'en'),
            alternateName: t(p.name, 'ar'),
            jobTitle: plain(t(p.headline, 'en')),
            description: plain(t(P.summary, 'en')),
            url: p.website,
            email: p.email ? 'mailto:' + p.email : undefined,
            telephone: p.phone,
            sameAs: [p.linkedin].filter(Boolean),
            knowsAbout: (P.competencies || []).map(c => t(c.name, 'en')),
            knowsLanguage: (P.languages || []).map(l => t(l.name, 'en')),
            hasCredential: (P.certifications || []).map(c => ({
                '@type': 'EducationalOccupationalCredential',
                name: t(c.name, 'en'),
                recognizedBy: { '@type': 'Organization', name: t(c.issuer, 'en') }
            })),
            alumniOf: (P.education || []).map(e => ({ '@type': 'EducationalOrganization', name: t(e.school, 'en') }))
        };
        let el = $('#jsonld');
        if (!el) {
            el = document.createElement('script');
            el.type = 'application/ld+json';
            el.id = 'jsonld';
            document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(data);
    }

    function renderAll() {
        renderMeta();
        applyStaticI18n();
        renderNav();
        renderHero();
        $$('[data-section]').forEach(sec => {
            const fn = renderers[sec.dataset.section];
            if (fn) sec.innerHTML = fn();
        });
        renderFooter();
        renderCvMenus();
        observeReveals();
        updateActiveNav();
    }

    /* ════════════════════════════════════════════════════════
       SCROLL REVEAL (with memory across re-renders)
    ════════════════════════════════════════════════════════ */
    const revealObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('anim'));
            el.style.transitionDelay = (Math.max(0, siblings.indexOf(el)) * 0.09) + 's';
            el.classList.add('visible');
            revealed.add(el.dataset.anim);
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }) : null;

    function observeReveals() {
        $$('.anim:not(.visible)').forEach(el => {
            if (!revealObserver || reduceMotion) {
                el.classList.add('visible');
                revealed.add(el.dataset.anim);
            } else {
                revealObserver.observe(el);
            }
        });
    }

    /* ════════════════════════════════════════════════════════
       ACTIVE NAV LINK
    ════════════════════════════════════════════════════════ */
    let activeId = '';
    function updateActiveNav() {
        $$('#navLinks a').forEach(a => {
            const on = a.getAttribute('href') === '#' + activeId;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
    }
    if ('IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { activeId = entry.target.id; updateActiveNav(); }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        $$('main section[id], footer[id]').forEach(s => navObserver.observe(s));
    }

    /* ════════════════════════════════════════════════════════
       CUSTOM CURSOR (fine pointers only, uses delegation so re-renders keep working)
    ════════════════════════════════════════════════════════ */
    if (finePointer && !reduceMotion) {
        document.body.classList.add('has-custom-cursor', 'cursor-hidden');
        const dot     = $('.cursor-dot');
        const outline = $('.cursor-outline');
        const hoverSel = 'a, button, .glass-card, .comp-item, .hl-card, .cert-item';

        window.addEventListener('mousemove', e => {
            document.body.classList.remove('cursor-hidden');
            dot.style.left = e.clientX + 'px';
            dot.style.top  = e.clientY + 'px';
            outline.animate(
                { left: e.clientX + 'px', top: e.clientY + 'px' },
                { duration: 450, fill: 'forwards' }
            );
        }, { passive: true });

        document.addEventListener('mouseover', e => {
            outline.classList.toggle('cursor-hover', !!e.target.closest(hoverSel));
        });
        document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
        document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
    }

    /* ════════════════════════════════════════════════════════
       HEADER, SCROLL PROGRESS, BACK TO TOP
    ════════════════════════════════════════════════════════ */
    const header   = $('#header');
    const progress = $('#scrollProgress');
    const toTop    = $('#backToTop');
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        header.classList.toggle('scrolled', y > 60);
        progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
        toTop.classList.toggle('show', y > window.innerHeight * 0.9);
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

    /* ════════════════════════════════════════════════════════
       MOBILE MENU
    ════════════════════════════════════════════════════════ */
    const hamburger = $('#hamburger');
    const navLinks  = $('#navLinks');

    function setMenu(open) {
        hamburger.classList.toggle('open', open);
        navLinks.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
    }
    hamburger.addEventListener('click', e => { e.stopPropagation(); setMenu(!navLinks.classList.contains('open')); });
    navLinks.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

    /* ════════════════════════════════════════════════════════
       CV DOWNLOAD MENUS
    ════════════════════════════════════════════════════════ */
    function closeCvMenus(except) {
        $$('[data-cv-menu]').forEach(host => {
            if (host === except) return;
            const menu = $('.cv-menu', host);
            const btn  = $('.btn-cv', host);
            if (menu) menu.hidden = true;
            if (btn) btn.setAttribute('aria-expanded', 'false');
            host.classList.remove('open');
        });
    }

    document.addEventListener('click', e => {
        const toggle = e.target.closest('.btn-cv');
        const option = e.target.closest('[data-cv-lang]');

        if (toggle) {
            const host = toggle.closest('[data-cv-menu]');
            const menu = $('.cv-menu', host);
            const open = menu.hidden;
            closeCvMenus(host);
            menu.hidden = !open;
            host.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
            if (open) $('[role="menuitem"]', menu)?.focus();
            return;
        }
        if (option) {
            closeCvMenus();
            window.CV.print(option.dataset.cvLang);
            return;
        }
        if (!e.target.closest('.cv-menu')) closeCvMenus();
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        const openHost = $('[data-cv-menu].open');
        closeCvMenus();
        setMenu(false);
        if (openHost) $('.btn-cv', openHost)?.focus();
    });

    // Ctrl+P / browser print → CV in the language currently shown on the site
    window.CV.bindBrowserPrint(() => lang);

    /* ════════════════════════════════════════════════════════
       TYPEWRITER
    ════════════════════════════════════════════════════════ */
    const typewriterEl = $('#typewriterText');
    let twIndex = 0, twChar = 0, twDeleting = false, twTimeout = null;

    function typeWriter() {
        const strings = t(P.titles, lang) || [];
        if (!strings.length) return;
        const current = strings[twIndex % strings.length];

        if (reduceMotion) {
            typewriterEl.textContent = current;
            twIndex++;
            twTimeout = setTimeout(typeWriter, 2600);
            return;
        }

        if (!twDeleting) {
            typewriterEl.textContent = current.slice(0, ++twChar);
            if (twChar >= current.length) {
                twDeleting = true;
                twTimeout = setTimeout(typeWriter, 1800);
                return;
            }
            twTimeout = setTimeout(typeWriter, 90);
        } else {
            typewriterEl.textContent = current.slice(0, --twChar);
            if (twChar <= 0) {
                twDeleting = false;
                twIndex++;
                twTimeout = setTimeout(typeWriter, 350);
                return;
            }
            twTimeout = setTimeout(typeWriter, 45);
        }
    }

    function restartTypewriter() {
        clearTimeout(twTimeout);
        typewriterEl.textContent = '';
        twIndex = 0; twChar = 0; twDeleting = false;
        typeWriter();
    }

    /* ════════════════════════════════════════════════════════
       LANGUAGE TOGGLE
    ════════════════════════════════════════════════════════ */
    function setLang(next) {
        lang = next;
        saveLang(lang);
        renderAll();
        restartTypewriter();
    }

    $('#langToggle').addEventListener('click', () => setLang(lang === 'en' ? 'ar' : 'en'));

    /* ── Boot ── */
    renderAll();
    renderJsonLd();
    restartTypewriter();
    onScroll();

    // Honour deep links (#projects) after content has been rendered
    if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) requestAnimationFrame(() => target.scrollIntoView());
    }
});
