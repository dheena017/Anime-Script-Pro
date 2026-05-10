import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const AUDIT_URL = process.env.AUDIT_URL || 'http://localhost:5173';
const OUTPUT_DIR = path.join(projectRoot, 'lighthouse-reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const options = {
  logLevel: 'info',
  output: ['json', 'html'],
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
};

const configPath = path.join(projectRoot, 'lighthouse.config.cjs');

async function runAudit() {
  try {
    console.log(chalk.blue(`\n🔍 Running Lighthouse audit on ${AUDIT_URL}...\n`));

    const runnerResult = await lighthouse(AUDIT_URL, {
      ...options,
      configPath,
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const reportHtml = path.join(OUTPUT_DIR, `lighthouse-${timestamp}.html`);
    const reportJson = path.join(OUTPUT_DIR, `lighthouse-${timestamp}.json`);

    // Save HTML report
    fs.writeFileSync(reportHtml, runnerResult.report[0]);
    console.log(chalk.green(`✓ HTML report saved: ${reportHtml}`));

    // Save JSON report
    fs.writeFileSync(reportJson, runnerResult.report[1]);
    console.log(chalk.green(`✓ JSON report saved: ${reportJson}`));

    // Display scores
    const scores = runnerResult.lhr.categories;
    console.log(chalk.cyan('\n📊 Audit Scores:\n'));

    Object.entries(scores).forEach(([key, category]) => {
      const score = Math.round(category.score * 100);
      const icon = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      console.log(`${icon} ${category.title}: ${score}`);
    });

    // Display summary
    console.log(chalk.cyan('\n📈 Performance Metrics:\n'));
    const metrics = runnerResult.lhr.audits;
    const metricsToShow = ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time'];

    metricsToShow.forEach((metricId) => {
      const metric = metrics[metricId];
      if (metric) {
        console.log(`${metric.title}: ${metric.displayValue}`);
      }
    });

    console.log(chalk.green('\n✅ Audit complete!\n'));
  } catch (error) {
    console.error(chalk.red('❌ Lighthouse audit failed:'), error);
    process.exit(1);
  }
}

runAudit();
