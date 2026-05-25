import { motion, useReducedMotion, Variants } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      scale: shouldReduceMotion ? 1 : 0.992,
      filter: shouldReduceMotion ? 'none' : 'blur(6px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -8,
      scale: shouldReduceMotion ? 1 : 0.994,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
      transition: {
        duration: 0.28,
        ease: [0.4, 0, 0.2, 1] as any,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full will-change-transform"
    >
      {children}
    </motion.div>
  );
};
