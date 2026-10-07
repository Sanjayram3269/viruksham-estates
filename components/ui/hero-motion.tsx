"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HeroMotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function HeroFadeIn({ children, className, delay = 0 }: HeroMotionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
