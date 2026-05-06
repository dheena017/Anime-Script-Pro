/**
 * LANDING MODULE GATEWAY
 * 
 * Central export registry for all Landing-tier architectural components, 
 * data constants, and production UI modules.
 */

// Primary Page Modules
export { default } from './LandingPage';
export { default as LandingPage } from './LandingPage';
export { default as LandingTopBar } from './LandingTopBar';
export { default as FooterLanding } from './FooterLanding';

// Data & Intelligence Layer
export * from './constants';

// Modular UI Components Registry
export * from './ui/HeroPromptBar';
export * from './ui/Gallery';
export * from './ui/Features';
export * from './ui/FAQ';
export * from './ui/NavComponents';

/**
 * PRODUCTION PROTOCOL:
 * All exports from this module are intended for high-fidelity 
 * Studio Architect interfaces. Ensure that consuming components 
 * are wrapped in appropriate Suspense boundaries.
 */



