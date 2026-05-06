# Lighthouse Integration Guide

## Overview
This project includes Google Lighthouse integration for performance, accessibility, SEO, and best practices auditing.

## Setup

1. **Install Lighthouse** (included in devDependencies):
```bash
npm install
```

## Usage

### Local Audits

Run an audit on your local development server:

```bash
# Start your dev server in one terminal
npm run dev

# In another terminal, run Lighthouse
npm run lighthouse
```

This generates an HTML report at `lighthouse-report.html`.

### CI/CD Audits

For CI/CD pipelines or JSON output:

```bash
npm run lighthouse:ci
```

This generates a JSON report at `lighthouse-report.json` suitable for parsing and analysis.

## Reports

- **HTML Reports**: Generated at root level (`lighthouse-report.html`) for manual review
- **JSON Reports**: Generated at root level (`lighthouse-report.json`) for automation
- **Historical Reports**: Archive in `lighthouse-reports/` directory with timestamps

## Configuration

Lighthouse settings are defined in `lighthouse.config.js`:

- **Categories**: Performance, Accessibility, Best Practices, SEO, PWA
- **Throttling**: Desktop (40ms RTT, 11Mbps throughput)
- **Form Factor**: Desktop (1350x940)
- **Timeout**: 35s max for load

## GitHub Actions

Automated audits run on push to `master`, `main`, or `develop` branches, and on pull requests. Results are:
1. Saved as artifacts
2. Posted as PR comments with score breakdown

## Metrics Tracked

### Performance
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Total Blocking Time (TBT)
- Speed Index
- Time to Interactive (TTI)

### Accessibility
- ARIA attributes
- Color contrast
- Image alt text
- Form labels

### Best Practices
- Vulnerable libraries
- HTTP/2 usage
- Passive event listeners

### SEO
- Meta descriptions
- Viewport configuration

### PWA
- Web manifest
- Service worker

## Interpreting Scores

- **90+**: Excellent 🟢
- **50-89**: Average 🟡
- **0-49**: Poor 🔴

## Troubleshooting

### "Target page might be invalid"
Ensure your dev server is running on `http://localhost:3000` (or set `AUDIT_URL` environment variable).

### Port Already in Use
Change the audit URL:
```bash
AUDIT_URL=http://localhost:3000 npm run lighthouse
```

### Large bundle sizes
Check the performance report for opportunities to split chunks or lazy-load components.

## Next Steps

1. Run an audit: `npm run lighthouse`
2. Review the HTML report
3. Address critical issues (red scores)
4. Set up baseline thresholds in CI/CD
