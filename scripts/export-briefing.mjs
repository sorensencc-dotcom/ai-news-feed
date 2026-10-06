import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Formats and writes a structured briefing payload into the Astro content collection.
 * 
 * @param {Object} payload
 * @param {string} payload.title
 * @param {string} payload.date - Format: YYYY-MM-DD
 * @param {number} [payload.sourcesEvaluated=8]
 * @param {number} payload.confidenceScore
 * @param {string} [payload.summary]
 * @param {Array<{name: string, delta7d: string, summary: string, tags: string[], primarySources: Array<{title: string, url: string}>}>} payload.themes
 * @param {string} [payload.bodyMarkdown]
 * @param {string} [contentDir]
 * @returns {string} Written file path
 */
export function exportBriefing(payload, contentDir) {
  const targetDir = contentDir || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/briefings');
  const dateStr = payload.date;
  const filePath = path.join(targetDir, `${dateStr}.md`);

  const escapeQuote = (str) => (str ? str.replace(/"/g, '\\"') : '');

  const frontmatter = [
    '---',
    `title: "${escapeQuote(payload.title)}"`,
    `date: ${dateStr}`,
    `sourcesEvaluated: ${payload.sourcesEvaluated ?? 8}`,
    `confidenceScore: ${payload.confidenceScore}`,
    payload.summary ? `summary: "${escapeQuote(payload.summary)}"` : null,
    'themes:',
    ...payload.themes.map((t) => [
      `  - name: "${escapeQuote(t.name)}"`,
      `    delta7d: "${t.delta7d}"`,
      `    summary: "${escapeQuote(t.summary)}"`,
      `    tags: [${(t.tags || []).map((tag) => `"${escapeQuote(tag)}"`).join(', ')}]`,
      '    primarySources:',
      ...(t.primarySources || []).map((s) => `      - title: "${escapeQuote(s.title)}"\n        url: "${s.url}"`),
    ].join('\n')),
    '---',
    '',
    payload.bodyMarkdown || '',
  ].filter(Boolean).join('\n');

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(filePath, frontmatter, 'utf8');
  return filePath;
}

// Self-check test execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Running exportBriefing self-check...');
  const testPayload = {
    title: 'Self-Check Briefing Test',
    date: '2026-10-07',
    sourcesEvaluated: 8,
    confidenceScore: 0.95,
    summary: 'Automated test briefing verifying pipeline formatting.',
    themes: [
      {
        name: 'Automated Verification Invariant',
        delta7d: 'accelerating',
        summary: 'Verifies pipeline export logic directly against Zod schema.',
        tags: ['DEPLOY', 'RESEARCH'],
        primarySources: [{ title: 'GitHub Actions Spec', url: 'https://docs.github.com' }]
      }
    ],
    bodyMarkdown: '## Test Execution\n\nSelf-check completed successfully.'
  };

  const written = exportBriefing(testPayload);
  console.log(`Successfully exported test briefing to: ${written}`);
}
