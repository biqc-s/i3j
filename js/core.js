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
        return value[lang] ?? value.en ?? '';
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

    /** Filter list items by visibility flags: item.site === false / item.cv === false. */
    function visible(list, target) {
        return (list || []).filter(item => item && item[target] !== false);
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

    window.Core = { LANGS, t, num, arDigits, formatMonth, formatRange, esc, plain, visible, detectLang, saveLang };
})();
