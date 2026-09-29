/* ════════════════════════════════════════════════════════════
   ATS CV RENDERER
   Builds a single-column, text-only résumé from data/content/*.json.
   ATS rules followed: standard section headings, real text (no images/icons),
   no tables or columns, bullet lists, consistent dates with Western digits,
   contact details as plain text in the body (not in page headers/footers).

   Used in two places:
   • index.html → hidden print root, printed via the "Download CV" menu or Ctrl+P
   • cv.html    → standalone preview page, shareable as cv.html?lang=ar
════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const { t, esc, plain, visible, formatRange, formatMonth, detectLang, saveLang, loadContent } = window.Core;
    const UI = window.UI;
    let P = window.PROFILE || {}; // refreshed from the loaded content on every build()

    /* ── Section builders ── */

    function section(key, lang, body) {
        if (!body) return '';
        return `
        <section class="cv-section cv-${key}">
            <h2>${esc(t(UI.cv[key], lang))}</h2>
            ${body}
        </section>`;
    }

    function contactLine(lang) {
        const p = P.person;
        const items = [];
        if (p.location) items.push(`<span>${esc(t(p.location, lang))}</span>`);
        if (p.phone)    items.push(`<a href="tel:${esc(p.phone)}" dir="ltr">${esc(p.phoneDisplay || p.phone)}</a>`);
        if (p.email)    items.push(`<a href="mailto:${esc(p.email)}" dir="ltr">${esc(p.email)}</a>`);
        if (p.linkedin) items.push(`<a href="${esc(p.linkedin)}" dir="ltr">${esc(p.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>`);
        if (p.website)  items.push(`<a href="${esc(p.website)}" dir="ltr">${esc(p.website.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>`);
        return items.join('<span class="cv-sep" aria-hidden="true"> | </span>');
    }

    function inlineList(items) {
        if (!items.length) return '';
        return `<p class="cv-inline">${items.map(esc).join('<span class="cv-sep"> • </span>')}</p>`;
    }

    function experience(lang) {
        const present = t(UI.labels.present, lang);
        return visible(P.experience, 'cv').map(job => {
            const org = [t(job.org, lang), t(job.location, lang)].filter(Boolean).join(lang === 'ar' ? '، ' : ', ');
            const points = visible(job.points, 'cv');
            return `
            <div class="cv-entry">
                <div class="cv-entry-head">
                    <h3>${esc(t(job.role, lang))}</h3>
                    <span class="cv-date">${esc(formatRange(job.start, job.end, lang, present))}</span>
                </div>
                <p class="cv-org">${esc(org)}</p>
                ${points.length ? `<ul>${points.map(pt => `<li>${esc(plain(t(pt, lang)))}</li>`).join('')}</ul>` : ''}
            </div>`;
        }).join('');
    }

    function projects(lang) {
        return visible(P.projects, 'cv').map(pr => {
            const award = pr.award ? ` (${esc(t(pr.award, lang))})` : '';
            return `
            <div class="cv-entry cv-entry-compact">
                <h3>${esc(t(pr.title, lang))}${award}</h3>
                <p>${esc(plain(t(pr.description, lang)))}</p>
            </div>`;
        }).join('');
    }

    function achievements(lang) {
        const items = visible(P.achievements, 'cv').map(a => {
            const meta = [t(a.issuer, lang), a.date ? formatMonth(a.date, lang) : ''].filter(Boolean).join(', ');
            const desc = plain(t(a.description, lang));
            return `<li><strong>${esc(t(a.title, lang))}</strong>${meta ? ` — ${esc(meta)}` : ''}${desc ? `. ${esc(desc)}` : ''}</li>`;
        });
        return items.length ? `<ul>${items.join('')}</ul>` : '';
    }

    function education(lang) {
        return visible(P.education, 'cv').map(ed => {
            const when = ed.inProgress ? t(UI.labels.inProgress, lang) : (ed.year ? String(ed.year) : '');
            return `
            <div class="cv-entry cv-entry-compact">
                <div class="cv-entry-head">
                    <h3>${esc(t(ed.degree, lang))}</h3>
                    ${when ? `<span class="cv-date">${esc(when)}</span>` : ''}
                </div>
                <p class="cv-org">${esc(t(ed.school, lang))}</p>
            </div>`;
        }).join('');
    }

    function certifications(lang) {
        const items = visible(P.certifications, 'cv').map(c => {
            const meta = [t(c.issuer, lang), c.year ? String(c.year) : ''].filter(Boolean).join(lang === 'ar' ? '، ' : ', ');
            return `<li>${esc(t(c.name, lang))}${meta ? ` — ${esc(meta)}` : ''}</li>`;
        });
        return items.length ? `<ul>${items.join('')}</ul>` : '';
    }

    function languages(lang) {
        const items = visible(P.languages, 'cv').map(l => `${t(l.name, lang)}: ${t(l.level, lang)}`);
        return inlineList(items);
    }

    /* ── Public: full CV markup ── */
    function build(lang) {
        P = window.PROFILE || {};
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        const skills = visible(P.competencies, 'cv').map(c => t(c.name, lang));
        const tools  = (P.tools || []).map(x => t(x, lang));

        const bodies = {
            summary:        () => (t(P.summary, lang) ? `<p>${esc(plain(t(P.summary, lang)))}</p>` : ''),
            skills:         () => inlineList(skills),
            experience:     () => experience(lang),
            projects:       () => projects(lang),
            achievements:   () => achievements(lang),
            education:      () => education(lang),
            certifications: () => certifications(lang),
            tools:          () => inlineList(tools),
            languages:      () => languages(lang)
        };
        // Order and visibility come from the dashboard (Site settings → CV sections)
        const order = (UI.cvOrder || Object.keys(bodies)).filter(id => bodies[id]);

        return `
        <article class="cv" lang="${lang}" dir="${dir}">
            <header class="cv-header">
                <h1 class="cv-name">${esc(t(P.person.name, lang))}</h1>
                <p class="cv-headline">${esc(t(P.person.headline, lang))}</p>
                <p class="cv-contact">${contactLine(lang)}</p>
            </header>
            ${order.map(id => section(id, lang, bodies[id]())).join('')}
        </article>`;
    }

    function fileTitle(lang) {
        return t(UI.cv.fileName, lang) + (lang === 'ar' ? '' : '-EN');
    }

    /* ── Printing from the main website (index.html) ── */
    let printRoot = null;
    let printingLang = null;

    function ensureRoot() {
        if (!printRoot) {
            printRoot = document.createElement('div');
            printRoot.id = 'cv-print-root';
            printRoot.className = 'cv-print-root';
            printRoot.setAttribute('aria-hidden', 'true');
            document.body.appendChild(printRoot);
        }
        return printRoot;
    }

    function prepare(lang) {
        ensureRoot().innerHTML = build(lang);
        printingLang = lang;
    }

    /** Print the CV in a specific language, independent of the site's current language. */
    function print(lang) {
        const prevTitle = document.title;
        prepare(lang);
        document.title = fileTitle(lang);
        const restore = () => {
            document.title = prevTitle;
            printingLang = null;
            window.removeEventListener('afterprint', restore);
        };
        window.addEventListener('afterprint', restore);
        window.print();
    }

    /** Ctrl+P / browser "Print" on the website → print the CV in the site's current language. */
    function bindBrowserPrint(getLang) {
        let prevTitle = null;
        window.addEventListener('beforeprint', () => {
            if (printingLang) return; // triggered by our own print() call
            const lang = getLang();
            prepare(lang);
            prevTitle = document.title;
            document.title = fileTitle(lang);
        });
        window.addEventListener('afterprint', () => {
            if (prevTitle !== null) { document.title = prevTitle; prevTitle = null; }
            printingLang = null;
        });
    }

    /* ── Standalone page (cv.html) ── */
    function initPage() {
        const mount = document.getElementById('cv');
        if (!mount) return;

        const params = new URLSearchParams(location.search);
        let lang = detectLang();

        const $ = sel => document.querySelector(sel);

        function render() {
            const isAr = lang === 'ar';
            document.documentElement.lang = lang;
            document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
            document.title = fileTitle(lang);
            mount.innerHTML = build(lang);

            document.querySelectorAll('[data-ui]').forEach(el => {
                const path = el.getAttribute('data-ui').split('.');
                const val  = path.reduce((o, k) => (o ? o[k] : undefined), UI);
                if (val) el.textContent = t(val, lang);
            });
            document.querySelectorAll('.cv-lang-btn').forEach(btn => {
                const active = btn.dataset.lang === lang;
                btn.classList.toggle('active', active);
                btn.setAttribute('aria-pressed', String(active));
            });

            const url = new URL(location.href);
            url.searchParams.set('lang', lang);
            url.searchParams.delete('print');
            history.replaceState(null, '', url);
            saveLang(lang);
        }

        document.querySelectorAll('.cv-lang-btn').forEach(btn => {
            btn.addEventListener('click', () => { lang = btn.dataset.lang; render(); });
        });

        $('#cvPrint')?.addEventListener('click', () => window.print());

        $('#cvCopy')?.addEventListener('click', async () => {
            const btn = $('#cvCopy');
            try {
                await navigator.clipboard.writeText(location.href);
                btn.classList.add('copied');
                btn.querySelector('span').textContent = t(UI.cv.toolbar.copied, lang);
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.querySelector('span').textContent = t(UI.cv.toolbar.copy, lang);
                }, 1800);
            } catch (_) { /* clipboard unavailable — ignore */ }
        });

        loadContent().then(render).catch(err => {
            mount.innerHTML = `<p style="color:#b00">Could not load CV content (${esc(err.message)}).</p>`;
            return Promise.reject(err);
        }).then(() => {
        if (params.get('print') === '1') {
            const go = () => setTimeout(() => window.print(), 250);
            (document.fonts && document.fonts.ready) ? document.fonts.ready.then(go) : go();
        }
        });
    }

    window.CV = { build, print, bindBrowserPrint, initPage, fileTitle };

    if (document.body && document.body.dataset.page === 'cv') initPage();
})();
