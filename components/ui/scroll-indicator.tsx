"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function ScrollIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="inline-flex items-center space-x-3 text-[#645d57]"
      aria-hidden="true"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
        SCROLL TO EXPLORE
      </span>
      <div className="relative h-7 w-[1px] overflow-hidden bg-[#e7e2d9]">
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#1e3a2b]"
            initial={{ height: "0%", top: "0%" }}
            animate={{
              height: ["0%", "100%", "0%"],
              top: ["0%", "0%", "100%"],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </div>
  );
}
