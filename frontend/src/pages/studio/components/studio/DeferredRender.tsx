import React, { useState, useEffect } from 'react';

interface DeferredRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

/**
 * DeferredRender - Prevents "Mounting Phase" lag by deferring the rendering of heavy components
 * to a subsequent frame. This allows the browser to handle the navigation transition/animation
 * first before doing the heavy work of calculating and mounting the component tree.
 */
export function DeferredRender({ children, fallback = null, delay = 0 }: DeferredRenderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // We use requestIdleCallback where available, otherwise requestAnimationFrame
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(() => {
        setIsReady(true);
      }, { timeout: delay || 16 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const handle = requestAnimationFrame(() => {
        setIsReady(true);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [delay]);

  if (!isReady) return <>{fallback}</>;
  return <>{children}</>;
}

