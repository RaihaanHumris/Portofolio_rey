"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionTemplate, useSpring } from "framer-motion";

const MAX_TILT = 14;
const PERSPECTIVE = 1100;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function ProfilePhoto() {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const rotateX = useSpring(0, { stiffness: 280, damping: 26 });
  const rotateY = useSpring(0, { stiffness: 280, damping: 26 });
  const glareX = useSpring(50, { stiffness: 200, damping: 24 });
  const glareY = useSpring(50, { stiffness: 200, damping: 24 });
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.38) 0%, transparent 58%)`;

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const updateTilt = useCallback(
    (clientX: number, clientY: number) => {
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const px = clamp(x / rect.width, 0, 1);
      const py = clamp(y / rect.height, 0, 1);

      rotateY.set((px - 0.5) * MAX_TILT * 2);
      rotateX.set((0.5 - py) * MAX_TILT * 2);
      glareX.set(px * 100);
      glareY.set(py * 100);
      setIsActive(true);
    },
    [rotateX, rotateY, glareX, glareY]
  );

  const resetTilt = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
    setIsActive(false);
  }, [rotateX, rotateY, glareX, glareY]);

  const show = () => {
    if (!isTouch) setRevealed(true);
  };

  const hide = () => {
    if (!isTouch) {
      setRevealed(false);
      resetTilt();
    }
  };

  const toggle = () => {
    if (isTouch) setRevealed((v) => !v);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouch) return;
    updateTilt(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    updateTilt(touch.clientX, touch.clientY);
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto md:mx-0"
      style={{ perspective: PERSPECTIVE }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        ref={cardRef}
        type="button"
        className="relative block w-full aspect-[4/5] sm:aspect-square rounded-3xl cursor-pointer touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low will-change-transform"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={show}
        onMouseLeave={hide}
        onMouseMove={handleMouseMove}
        onFocus={show}
        onBlur={hide}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (touch) updateTilt(touch.clientX, touch.clientY);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetTilt}
        onClick={toggle}
        aria-pressed={revealed}
        aria-label={revealed ? "Sembunyikan info profil" : "Ketuk untuk melihat info profil"}
      >
        <div
          className="absolute -inset-3 rounded-[1.75rem] bg-white/[0.04] blur-xl transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: isActive || revealed ? 0.9 : 0.35,
            transform: "translateZ(-40px)",
          }}
        />

        <div
          className="relative w-full h-full rounded-3xl overflow-hidden border border-white/15 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
          style={{ transform: "translateZ(0)" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: revealed ? 1.06 : 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: "translateZ(12px)" }}
          >
            <Image
              src="/about.jpg"
              alt="Foto Muhammad Raihaan Humris"
              fill
              sizes="(min-width: 768px) 420px, 100vw"
              className={`object-cover transition-all duration-700 ${
                revealed ? "grayscale-0 brightness-100" : "grayscale brightness-[0.72]"
              }`}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
            style={{
              background: glareBackground,
              opacity: isActive ? 1 : 0.15,
              transform: "translateZ(20px)",
            }}
          />

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.25) 100%)",
              transform: "translateZ(16px)",
            }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 pointer-events-none"
            style={{ transform: "translateZ(8px)" }}
          />

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center bg-slate-950/55 backdrop-blur-md"
                style={{ transform: "translateZ(28px)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                  className="space-y-3"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Web Developer
                  </p>
                  <h3 className="font-headline text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Raihaan Humris
                  </h3>
                  <motion.div
                    className="flex items-center justify-center gap-3"
                    style={{ transform: "translateZ(12px)" }}
                  >
                    <span className="h-px w-10 bg-white/30" />
                    <span className="font-label text-xs uppercase tracking-[0.35em] text-white/90">
                      EST. 2026
                    </span>
                    <span className="h-px w-10 bg-white/30" />
                  </motion.div>
                  <p className="text-[11px] text-slate-400 tracking-wide pt-1">
                    Ende, Nusa Tenggara Timur
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 font-label text-[9px] uppercase tracking-[0.3em] text-white/70 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 pointer-events-none md:hidden"
              style={{ transform: "translateZ(24px)" }}
            >
              Ketuk & geser foto
            </motion.span>
          )}
        </div>
      </motion.button>

      <p className="hidden md:block mt-3 text-center text-[10px] uppercase tracking-[0.25em] text-slate-500 font-label">
        Gerakkan kursor di atas foto
      </p>
    </motion.div>
  );
}
