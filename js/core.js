/* ════════════════════════════════════════════════════════════
   CORE HELPERS — shared by the website (site.js) and the CV (cv.js)
════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const LANGS = ['en', 'ar'];

    const MONTHS = {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    };

    /** Pick the value for a language from a bilingual field ({en, ar}) or return plain strings as-is. */
    function t(value, lang) {
        if (value == null) return '';
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        return value[lang] || value.en || '';
    }

    /** Convert Western digits to Arabic-Indic digits (used for decorative text on the website only). */
    function arDigits(str) {
        return String(str).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    }

    /** Localise digits for on-screen display. The CV always keeps Western digits for ATS parsing. */
    function num(value, lang) {
        return lang === 'ar' ? arDigits(value) : String(value);
    }

    /** 'YYYY-MM' → 'Apr 2024' / 'أبريل 2024'. */
    function formatMonth(ym, lang) {
        if (!ym) return '';
        const [y, m] = String(ym).split('-');
        if (!m) return y;
        return MONTHS[lang][Number(m) - 1] + ' ' + y;
    }

    function formatRange(start, end, lang, presentLabel) {
        return formatMonth(start, lang) + ' – ' + (end ? formatMonth(end, lang) : presentLabel);
    }

    /** Escape text for safe insertion into HTML. */
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /** Remove the limited markup allowed in profile text (e.g. <strong>) → plain text. */
    function plain(html) {
        const tpl = document.createElement('template');
        tpl.innerHTML = html;
        return tpl.content.textContent.replace(/\s+/g, ' ').trim();
    }

    /** Filter list items by the dashboard's visibility switches (hideFromSite / hideFromCv). */
    function visible(list, target) {
        const flag = target === 'cv' ? 'hideFromCv' : 'hideFromSite';
        return (list || []).filter(item => item && !item[flag]);
    }

    /* ── Content loading ──
       Content lives in data/content/*.json and is edited from the Pages CMS dashboard.
       The files are merged into one PROFILE object used by the site and the CV. */
    // Files that may be missing (e.g. a section added later) fall back to an empty list.
    const CONTENT_FILES = ['profile', 'experience', 'projects', 'achievements', 'skills', 'education', 'testimonials', 'settings'];
    const OPTIONAL_FILES = ['achievements', 'testimonials', 'settings'];

    const filled = v => v && (typeof v === 'string' ? v.trim() : (v.en || v.ar));

    /** Overlay the dashboard's "Site settings" (settings.json) on the default labels in data/ui.js. */
    function applySettings(S) {
        const UI = window.UI;
        if (!S || Array.isArray(S) || !UI) return;
        const set = (obj, key, val) => { if (filled(val)) obj[key] = val; };

        if (S.meta) { set(UI.meta, 'title', S.meta.title); set(UI.meta, 'description', S.meta.description); }
        if (S.hero) {
            ['greeting', 'available', 'cta'].forEach(k => set(UI.hero, k, S.hero[k]));
            set(UI.cvMenu, 'button', S.hero.cvButton);
        }
        if (S.contact) set(UI.contact, 'subtitle', S.contact.subtitle);

        if (Array.isArray(S.sections) && S.sections.length) {
            UI.order = [];
            UI.hiddenSections = [];
            UI.navHidden = [];
            S.sections.forEach(sec => {
                if (!sec || !sec.id) return;
                const id = sec.id;
                if (sec.show === false) UI.hiddenSections.push(id);
                if (sec.inNav === false) UI.navHidden.push(id);
                if (id !== 'contact') UI.order.push(id);
                set(UI.nav, id, sec.nav);
                if (id === 'contact') {
                    UI.contact.title = [sec.title || UI.contact.title[0], filled(sec.highlight) ? sec.highlight : UI.contact.title[1]];
                } else {
                    const cur = UI.sections[id] || { tag: sec.nav, title: [{ en: '', ar: '' }, { en: '', ar: '' }] };
                    UI.sections[id] = {
                        tag: filled(sec.tag) ? sec.tag : cur.tag,
                        title: [sec.title || cur.title[0], filled(sec.highlight) ? sec.highlight : cur.title[1]]
                    };
                }
            });
        }

        if (S.cv && Array.isArray(S.cv.sections) && S.cv.sections.length) {
            UI.cvOrder = [];
            S.cv.sections.forEach(sec => {
                if (!sec || !sec.id) return;
                if (sec.show !== false) UI.cvOrder.push(sec.id);
                set(UI.cv, sec.id, sec.title);
            });
        }
    }

    let contentPromise = null;
    function loadContent() {
        if (contentPromise) return contentPromise;
        const base = document.querySelector('script[src$="js/core.js"]')?.src.replace(/js\/core\.js.*$/, '') || '';
        contentPromise = Promise.all(CONTENT_FILES.map(name =>
            fetch(`${base}data/content/${name}.json`, { cache: 'no-cache' }).then(r => {
                if (!r.ok) throw new Error(`${name}.json: HTTP ${r.status}`);
                return r.json();
            }).catch(err => {
                if (OPTIONAL_FILES.includes(name)) { console.warn(err); return name === 'settings' ? {} : []; }
                throw err;
            })
        )).then(([profile, experience, projects, achievements, skills, education, testimonials, settings]) => {
            settings = Array.isArray(settings) ? {} : (settings || {});
            applySettings(settings);
            window.PROFILE = { ...profile, ...skills, experience, projects, achievements, education, testimonials, settings };
            return window.PROFILE;
        });
        return contentPromise;
    }

    /** Resolve an image path from the content files (relative to the site root, or absolute URL). */
    function asset(path) {
        if (!path) return '';
        if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
        return path.replace(/^\/+/, '');
    }

    /** Resolve the preferred language: ?lang= → saved choice → browser language → English. */
    function detectLang() {
        try {
            const q = new URLSearchParams(location.search).get('lang');
            if (LANGS.includes(q)) return q;
        } catch (_) {}
        try {
            const saved = localStorage.getItem('lang');
            if (LANGS.includes(saved)) return saved;
        } catch (_) {}
        const nav = (navigator.language || '').toLowerCase();
        return nav.startsWith('ar') ? 'ar' : 'en';
    }

    function saveLang(lang) {
        try { localStorage.setItem('lang', lang); } catch (_) {}
    }

    window.Core = { LANGS, t, num, arDigits, formatMonth, formatRange, esc, plain, visible, detectLang, saveLang, loadContent, asset };
})();
