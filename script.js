/* ════════════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — Saeed Ahmad Jahash
   Features: Language Toggle (EN/AR), Typewriter, Animations,
             Custom Cursor, Mobile Menu, Active Nav, Header Scroll
════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── State ── */
    let currentLang = 'en';

    /* ════════════════════════════════════════════════════════
       1. CUSTOM CURSOR (desktop only)
    ════════════════════════════════════════════════════════ */
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        const dot     = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');

        window.addEventListener('mousemove', e => {
            dot.style.left = e.clientX + 'px';
            dot.style.top  = e.clientY + 'px';
            outline.animate(
                { left: e.clientX + 'px', top: e.clientY + 'px' },
                { duration: 450, fill: 'forwards' }
            );
        });

        document.querySelectorAll('a, button, .glass-card, .comp-item, .hl-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                outline.style.width  = '58px';
                outline.style.height = '58px';
                outline.style.backgroundColor = 'rgba(212,175,55,0.08)';
                outline.style.opacity = '0.6';
            });
            el.addEventListener('mouseleave', () => {
                outline.style.width  = '38px';
                outline.style.height = '38px';
                outline.style.backgroundColor = 'transparent';
                outline.style.opacity = '0.7';
            });
        });
    }

    /* ════════════════════════════════════════════════════════
       2. HEADER SCROLL EFFECT
    ════════════════════════════════════════════════════════ */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ════════════════════════════════════════════════════════
       3. MOBILE HAMBURGER MENU
    ════════════════════════════════════════════════════════ */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });

    /* ════════════════════════════════════════════════════════
       4. SMOOTH SCROLLING
    ════════════════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = window.scrollY + target.getBoundingClientRect().top - 85;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    /* ════════════════════════════════════════════════════════
       5. ACTIVE NAV LINK ON SCROLL
    ════════════════════════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navItems.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => navObserver.observe(s));

    /* ════════════════════════════════════════════════════════
       6. SCROLL REVEAL ANIMATIONS
    ════════════════════════════════════════════════════════ */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay based on sibling index within parent grid
                const siblings = Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('anim'));
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = (idx * 0.09) + 's';
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.anim').forEach(el => revealObserver.observe(el));

    /* ════════════════════════════════════════════════════════
       7. TYPEWRITER EFFECT
    ════════════════════════════════════════════════════════ */
    const typewriterEl = document.getElementById('typewriterText');

    const typewriterStrings = {
        en: [
            'Transformational Leader',
            'CEO & Strategist',
            'PMP® Certified',
            'ISO 9001 Lead Auditor',
            'Digital Innovator'
        ],
        ar: [
            'قائد تحويلي',
            'رئيس تنفيذي واستراتيجي',
            'معتمد PMP®',
            'مدقق رائد ISO 9001',
            'مبتكر رقمي'
        ]
    };

    let twIndex    = 0;
    let twChar     = 0;
    let twDeleting = false;
    let twTimeout  = null;

    function typeWriter() {
        const strings  = typewriterStrings[currentLang];
        const current  = strings[twIndex % strings.length];
        const speed    = twDeleting ? 45 : 90;
        const pauseEnd = 1800;
        const pauseStart = 350;

        if (!twDeleting && twChar <= current.length) {
            typewriterEl.textContent = current.slice(0, twChar++);
            if (twChar > current.length) {
                twTimeout = setTimeout(() => { twDeleting = true; typeWriter(); }, pauseEnd);
                return;
            }
        } else if (twDeleting && twChar >= 0) {
            typewriterEl.textContent = current.slice(0, twChar--);
            if (twChar < 0) {
                twDeleting = false;
                twIndex++;
                twTimeout = setTimeout(typeWriter, pauseStart);
                return;
            }
        }

        twTimeout = setTimeout(typeWriter, speed);
    }

    function restartTypewriter() {
        clearTimeout(twTimeout);
        typewriterEl.textContent = '';
        twIndex    = 0;
        twChar     = 0;
        twDeleting = false;
        typeWriter();
    }

    typeWriter();

    /* ════════════════════════════════════════════════════════
       8. LANGUAGE TOGGLE
    ════════════════════════════════════════════════════════ */
    const langToggle = document.getElementById('langToggle');

    function applyLanguage(lang) {
        currentLang = lang;
        const isAr  = lang === 'ar';

        // Update HTML attrs
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

        // Update page title
        document.title = isAr
            ? 'سعيد أحمد جهاش | قائد تحويلي'
            : 'Saeed Ahmad Jahash | Transformational Leader';

        // Translate all [data-en] elements
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(isAr ? 'data-ar' : 'data-en');
            if (text !== null) el.innerHTML = text;
        });

        // Toggle button state
        langToggle.classList.toggle('ar-active', isAr);

        // Handle RTL mobile nav slide direction
        const navEl = document.querySelector('.nav-links');
        if (isAr) {
            navEl.style.right = 'auto';
            navEl.style.left  = navEl.classList.contains('open') ? '0' : '-100%';
        } else {
            navEl.style.left  = 'auto';
            navEl.style.right = navEl.classList.contains('open') ? '0' : '-100%';
        }

        // Save preference
        try { localStorage.setItem('lang', lang); } catch (_) {}

        // Restart typewriter with new language
        restartTypewriter();
    }

    langToggle.addEventListener('click', () => {
        applyLanguage(currentLang === 'en' ? 'ar' : 'en');
    });

    // Restore saved language
    try {
        const saved = localStorage.getItem('lang');
        if (saved && saved !== 'en') applyLanguage(saved);
    } catch (_) {}

    /* ════════════════════════════════════════════════════════
       9. HERO SECTION — ensure #hero takes full viewport
          but doesn't block under the fixed nav on mobile
    ════════════════════════════════════════════════════════ */
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.style.minHeight = '100dvh';
    }

});
