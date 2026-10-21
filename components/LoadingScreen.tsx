"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pada mobile / layar sentuh, lewati loading screen agar FCP & LCP instan sesuai rekomendasi PageSpeed
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsLoading(false);
      return;
    }

    // Lock scroll during loading di desktop
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          className="hidden md:flex fixed inset-0 z-[9999] flex-col items-center justify-center bg-[#080c14]"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Circular progress ring */}
          <div className="relative flex items-center justify-center mb-8">
            <svg
              className="absolute w-24 h-24 -rotate-90"
              viewBox="0 0 96 96"
            >
              <circle
                cx="48" cy="48" r="44"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              <motion.circle
                cx="48" cy="48" r="44"
                fill="none"
                stroke="rgba(185, 200, 222, 0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                style={{
                  strokeDasharray: "1",
                  strokeDashoffset: "0",
                }}
              />
            </svg>

            {/* Brand initials */}
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-2xl font-extrabold text-white tracking-tight">
                RH
              </span>
            </motion.div>
          </div>

          {/* Loading text */}
          <motion.p
            className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Memuat...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
