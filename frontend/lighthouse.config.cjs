module.exports = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15000,
    maxWaitForLoad: 35000,
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 11024,
      cpuSlowdownMultiplier: 1,
      downloadThroughputKbps: 11024,
      uploadThroughputKbps: 3400,
    },
    emulatedUserAgent: true,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
  },
  audits: [],
  categories: {
    performance: {
      title: 'Performance',
      description: 'These metrics validate the performance of the application.',
      auditRefs: [
        { id: 'first-contentful-paint', weight: 10, group: 'metrics' },
        { id: 'largest-contentful-paint', weight: 25, group: 'metrics' },
        { id: 'cumulative-layout-shift', weight: 15, group: 'metrics' },
        { id: 'total-blocking-time', weight: 30, group: 'metrics' },
        { id: 'speed-index', weight: 10, group: 'metrics' },
        { id: 'interactive', weight: 10, group: 'metrics' },
      ],
    },
    accessibility: {
      title: 'Accessibility',
      description: 'These checks validate the accessibility of the application.',
      auditRefs: [
        { id: 'aria-required-attr', weight: 10 },
        { id: 'color-contrast', weight: 10 },
        { id: 'image-alt', weight: 10 },
        { id: 'label', weight: 10 },
      ],
    },
    'best-practices': {
      title: 'Best Practices',
      description: 'We list audits for features we think all web apps should aim to implement.',
      auditRefs: [
        { id: 'no-vulnerable-libraries', weight: 8 },
        { id: 'uses-http2', weight: 3 },
        { id: 'uses-passive-event-listeners', weight: 3 },
      ],
    },
    seo: {
      title: 'SEO',
      description: 'Search Engine Optimization audits.',
      auditRefs: [
        { id: 'meta-description', weight: 10 },
        { id: 'viewport', weight: 10 },
      ],
    },
    pwa: {
      title: 'PWA',
      description: 'These checks validate the PWA baseline.',
      auditRefs: [
        { id: 'installable-manifest', weight: 10 },
        { id: 'service-worker', weight: 20 },
      ],
    },
  },
};
