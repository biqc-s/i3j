#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════
   Validates data/profile.js and data/ui.js before deployment.
   Usage:  node scripts/validate-profile.mjs

   Checks:
   • both files parse without syntax errors
   • every bilingual field has non-empty `en` and `ar` values
   • dates use the YYYY-MM format and start <= end
   • required sections and fields exist
════════════════════════════════════════════════════════════ */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function load(file) {
    const sandbox = { window: {} };
    try {
        vm.runInNewContext(readFileSync(join(root, file), 'utf8'), sandbox, { filename: file });
    } catch (err) {
        errors.push(`${file}: syntax error — ${err.message}`);
    }
    return sandbox.window;
}

const { PROFILE } = load('data/profile.js');
const { UI } = load('data/ui.js');

const isBilingual = v => v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'ar' in v);

/** Walk the object tree and verify every {en, ar} pair is complete. */
function checkBilingual(node, path) {
    if (Array.isArray(node)) return node.forEach((v, i) => checkBilingual(v, `${path}[${i}]`));
    if (!node || typeof node !== 'object') return;
    if (isBilingual(node)) {
        for (const lang of ['en', 'ar']) {
            const v = node[lang];
            const empty = v == null || (typeof v === 'string' && v.trim() === '' && node[lang === 'en' ? 'ar' : 'en']?.toString().trim() !== '');
            if (v == null) errors.push(`${path}: missing "${lang}" translation`);
            else if (empty) warnings.push(`${path}: "${lang}" is empty`);
        }
        return;
    }
    for (const [k, v] of Object.entries(node)) checkBilingual(v, path ? `${path}.${k}` : k);
}

const YM = /^\d{4}-(0[1-9]|1[0-2])$/;

if (PROFILE) {
    checkBilingual(PROFILE, 'PROFILE');

    const required = ['person', 'experience', 'projects', 'competencies', 'certifications', 'education'];
    required.forEach(k => { if (!PROFILE[k]) errors.push(`PROFILE.${k} is required`); });

    const p = PROFILE.person || {};
    ['name', 'headline', 'email'].forEach(k => { if (!p[k]) errors.push(`PROFILE.person.${k} is required`); });
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors.push(`PROFILE.person.email looks invalid: ${p.email}`);

    (PROFILE.experience || []).forEach((job, i) => {
        const at = `PROFILE.experience[${i}]`;
        if (!job.role) errors.push(`${at}.role is required`);
        if (!job.org) errors.push(`${at}.org is required`);
        if (!YM.test(job.start || '')) errors.push(`${at}.start must be "YYYY-MM" (got ${JSON.stringify(job.start)})`);
        if (job.end != null && !YM.test(job.end)) errors.push(`${at}.end must be "YYYY-MM" or null (got ${JSON.stringify(job.end)})`);
        if (YM.test(job.start || '') && YM.test(job.end || '') && job.start > job.end) errors.push(`${at}: start is after end`);
        if (!Array.isArray(job.points) || !job.points.length) warnings.push(`${at}: no bullet points — ATS CVs work best with 2–5 achievements per role`);
    });

    const starts = (PROFILE.experience || []).map(j => j.start);
    const sorted = [...starts].sort().reverse();
    if (starts.join() !== sorted.join()) warnings.push('PROFILE.experience is not ordered newest → oldest');

    (PROFILE.education || []).forEach((ed, i) => {
        if (!ed.inProgress && ed.year == null) warnings.push(`PROFILE.education[${i}]: set "year" or "inProgress: true"`);
    });

    const summaryLen = (PROFILE.summary?.en || '').split(/\s+/).length;
    if (summaryLen > 90) warnings.push(`PROFILE.summary.en has ${summaryLen} words — keep it under ~90 for ATS/recruiters`);
}

if (UI) checkBilingual(UI, 'UI');

warnings.forEach(w => console.warn('⚠️  ' + w));
errors.forEach(e => console.error('❌ ' + e));

if (errors.length) {
    console.error(`\n${errors.length} error(s) found. Fix them before publishing.`);
    process.exit(1);
}
console.log(`✅ Profile data is valid${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
