#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════
   Validates the site content before deployment.
   Usage:  node scripts/validate-profile.mjs

   Checks data/content/*.json (edited from the Pages CMS dashboard) and data/ui.js:
   • every file is valid JSON with the expected shape
   • required bilingual fields have both `en` and `ar` (missing Arabic → warning)
   • dates use YYYY-MM and start <= end
   • every referenced image exists in the repository
════════════════════════════════════════════════════════════ */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function readJson(name, expect) {
    const file = `data/content/${name}.json`;
    try {
        const data = JSON.parse(readFileSync(join(root, file), 'utf8'));
        if (expect === 'array' && !Array.isArray(data)) errors.push(`${file}: must be a list`);
        if (expect === 'object' && (Array.isArray(data) || typeof data !== 'object' || !data)) errors.push(`${file}: must be an object`);
        return data;
    } catch (err) {
        errors.push(`${file}: ${err.code === 'ENOENT' ? 'file is missing' : 'invalid JSON — ' + err.message}`);
        return expect === 'array' ? [] : {};
    }
}

const profile      = readJson('profile', 'object');
const experience   = readJson('experience', 'array');
const projects     = readJson('projects', 'array');
const achievements = readJson('achievements', 'array');
const skills       = readJson('skills', 'object');
const education    = readJson('education', 'array');
const testimonials = existsSync(join(root, 'data/content/testimonials.json')) ? readJson('testimonials', 'array') : [];

const str = v => (v == null ? '' : String(v).trim());

/** A bilingual value {en, ar}. required → English must exist; Arabic missing is a warning. */
function bi(value, path, { required = false } = {}) {
    if (value == null || value === '') {
        if (required) errors.push(`${path}: is required`);
        return;
    }
    if (typeof value === 'string') return; // plain text is allowed (same in both languages)
    const en = str(value.en), ar = str(value.ar);
    if (required && !en && !ar) errors.push(`${path}: is required`);
    else if (en && !ar) warnings.push(`${path}: Arabic translation is missing (English will be shown)`);
    else if (!en && ar) warnings.push(`${path}: English translation is missing`);
}

const YM = /^\d{4}-(0[1-9]|1[0-2])$/;
function ym(value, path, { required = false } = {}) {
    const v = str(value);
    if (!v) { if (required) errors.push(`${path}: date is required (YYYY-MM)`); return; }
    if (!YM.test(v)) errors.push(`${path}: date must be YYYY-MM (got "${v}")`);
}

function image(value, path) {
    const v = str(value);
    if (!v || /^(https?:)?\/\//.test(v)) return;
    if (!existsSync(join(root, v.replace(/^\/+/, '')))) errors.push(`${path}: image not found in the repository (${v})`);
}

/** Attached PDF (dashboard "PDF file" field): must exist, be a .pdf, and stay reasonably small. */
function pdf(value, path) {
    const v = str(value);
    if (!v || /^(https?:)?\/\//.test(v)) return;
    const file = join(root, v.replace(/^\/+/, ''));
    if (!existsSync(file)) { errors.push(`${path}: file not found in the repository (${v})`); return; }
    if (!/\.pdf$/i.test(v)) errors.push(`${path}: only PDF files are allowed (${v})`);
    const mb = statSync(file).size / 1024 / 1024;
    if (mb > 20) errors.push(`${path}: file is ${mb.toFixed(1)} MB — keep PDFs under 20 MB (compress it first)`);
    else if (mb > 5) warnings.push(`${path}: file is ${mb.toFixed(1)} MB — consider compressing it for faster loading`);
}

function list(items, path, fn) {
    (Array.isArray(items) ? items : []).forEach((item, i) => fn(item || {}, `${path}[${i + 1}]`));
}

/* ── profile.json ── */
const p = profile.person || {};
bi(p.name, 'profile › name', { required: true });
bi(p.headline, 'profile › headline', { required: true });
bi(p.location, 'profile › location');
image(p.photo, 'profile › photo');
if (!str(p.email)) errors.push('profile › email: is required');
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors.push(`profile › email looks invalid: ${p.email}`);
bi(profile.summary, 'profile › summary', { required: true });
const summaryWords = str(profile.summary?.en).split(/\s+/).filter(Boolean).length;
if (summaryWords > 90) warnings.push(`profile › summary (English) has ${summaryWords} words — keep it under ~90 for ATS/recruiters`);
list(profile.titles, 'profile › titles', (x, at) => bi(x, at, { required: true }));
list(profile.stats, 'profile › stats', (x, at) => {
    bi(x.label, `${at} › label`, { required: true });
    if (!str(x.value) && !str(x.auto)) warnings.push(`${at}: set a value or an automatic count`);
});
list(profile.about, 'profile › about', (x, at) => bi(x, at, { required: true }));
list(profile.highlights, 'profile › highlights', (x, at) => { bi(x.title, `${at} › title`, { required: true }); bi(x.text, `${at} › text`); });
list(profile.languages, 'profile › languages', (x, at) => { bi(x.name, `${at} › name`, { required: true }); bi(x.level, `${at} › level`); });

/* ── experience.json ── */
list(experience, 'experience', (job, at) => {
    bi(job.role, `${at} › role`, { required: true });
    bi(job.org, `${at} › organisation`, { required: true });
    bi(job.location, `${at} › location`);
    bi(job.tag, `${at} › tag`);
    ym(job.start, `${at} › start`, { required: true });
    ym(job.end, `${at} › end`);
    if (YM.test(str(job.start)) && YM.test(str(job.end)) && job.start > job.end) errors.push(`${at}: start date is after end date`);
    if (!Array.isArray(job.points) || !job.points.length) warnings.push(`${at}: no bullet points — ATS CVs work best with 2–5 achievements per role`);
    list(job.points, `${at} › points`, (x, a) => bi(x, a, { required: true }));
});
const starts = experience.map(j => str(j.start));
if (starts.join() !== [...starts].sort().reverse().join()) warnings.push('experience: not ordered newest → oldest');

/* ── projects.json ── */
list(projects, 'projects', (pr, at) => {
    bi(pr.title, `${at} › title`, { required: true });
    bi(pr.description, `${at} › description`);
    bi(pr.award, `${at} › award`);
    image(pr.image, `${at} › image`);
    pdf(pr.file, `${at} › file`);
    list(pr.tags, `${at} › tags`, (x, a) => bi(x, a));
});

/* ── achievements.json ── */
list(achievements, 'achievements', (a, at) => {
    bi(a.title, `${at} › title`, { required: true });
    bi(a.issuer, `${at} › issuer`);
    bi(a.description, `${at} › description`);
    ym(a.date, `${at} › date`);
    image(a.image, `${at} › image`);
    pdf(a.file, `${at} › file`);
});

/* ── skills.json ── */
list(skills.competencies, 'skills › competencies', (c, at) => bi(c.name, at, { required: true }));
list(skills.certifications, 'skills › certifications', (c, at) => {
    bi(c.name, `${at} › name`, { required: true });
    bi(c.issuer, `${at} › issuer`);
    pdf(c.file, `${at} › file`);
    if (str(c.year) && !/^\d{4}$/.test(str(c.year))) errors.push(`${at} › year: must be a 4-digit year`);
});

/* ── education.json ── */
list(education, 'education', (ed, at) => {
    bi(ed.degree, `${at} › degree`, { required: true });
    bi(ed.school, `${at} › school`, { required: true });
    pdf(ed.file, `${at} › file`);
    if (!ed.inProgress && !str(ed.year)) warnings.push(`${at}: set the graduation year or mark it "in progress"`);
});

/* ── testimonials.json ── */
list(testimonials, 'testimonials', (r, at) => {
    bi(r.name, `${at} › name`, { required: true });
    bi(r.role, `${at} › role`);
    bi(r.text, `${at} › text`, { required: true });
    ym(r.date, `${at} › date`);
    image(r.photo, `${at} › photo`);
});

/* ── settings.json (Site settings page) ── */
if (existsSync(join(root, 'data/content/settings.json'))) {
    const settings = readJson('settings', 'object');
    const ap = settings.appearance || {};
    const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
    ['accent', 'accent2'].forEach(k => {
        if (str(ap[k]) && !HEX.test(str(ap[k]))) errors.push(`settings › appearance › ${k}: colour must look like #d4af37 (got "${ap[k]}")`);
    });
    if (ap.theme && !['dark', 'light', 'auto'].includes(ap.theme)) errors.push(`settings › appearance › theme: must be dark, light or auto`);

    const checkIds = (items, allowed, at) => {
        const ids = (Array.isArray(items) ? items : []).map(x => x && x.id);
        ids.forEach((id, i) => { if (!allowed.includes(id)) errors.push(`${at}[${i + 1}]: unknown section "${id}"`); });
        const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
        if (dup.length) errors.push(`${at}: section listed twice (${[...new Set(dup)].join(', ')})`);
        const missing = allowed.filter(id => !ids.includes(id));
        if (ids.length && missing.length) warnings.push(`${at}: missing ${missing.join(', ')} (defaults will be used)`);
    };
    checkIds(settings.sections, ['about', 'experience', 'projects', 'achievements', 'skills', 'education', 'testimonials', 'contact'], 'settings › sections');
    checkIds(settings.cv?.sections, ['summary', 'skills', 'experience', 'projects', 'achievements', 'education', 'certifications', 'tools', 'languages'], 'settings › cv › sections');
    list(settings.sections, 'settings › sections', (s, at) => { bi(s.nav, `${at} › nav`); bi(s.highlight, `${at} › highlight`); });
    list(settings.cv?.sections, 'settings › cv › sections', (s, at) => bi(s.title, `${at} › title`));
}

/* ── ui.js ── */
try {
    const sandbox = { window: {} };
    vm.runInNewContext(readFileSync(join(root, 'data/ui.js'), 'utf8'), sandbox, { filename: 'data/ui.js' });
    if (!sandbox.window.UI) errors.push('data/ui.js: window.UI is not defined');
} catch (err) {
    errors.push(`data/ui.js: syntax error — ${err.message}`);
}

warnings.forEach(w => console.warn('⚠️  ' + w));
errors.forEach(e => console.error('❌ ' + e));

if (errors.length) {
    console.error(`\n${errors.length} error(s) found — the site was NOT published. Fix them from the dashboard and save again.`);
    process.exit(1);
}
console.log(`✅ Content is valid${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
