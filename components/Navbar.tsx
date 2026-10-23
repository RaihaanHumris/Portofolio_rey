"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, site, type SectionId } from "@/lib/site";

export default function Navbar() {
  const [active, setActive] = useState<SectionId>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const elements = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.45] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActive(id as SectionId);
    setMenuOpen(false);

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const iconLinkClass = (isActive: boolean) =>
    [
      "flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200",
      isActive
        ? "bg-white text-[#0a0f1a]"
        : "text-slate-500 hover:text-white hover:bg-white/[0.06]",
    ].join(" ");

  const menuLinkClass = (isActive: boolean) =>
    [
      "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200",
      isActive
        ? "bg-white/[0.1] text-white"
        : "text-slate-400 hover:text-white hover:bg-white/[0.05]",
    ].join(" ");

  return (
    <>
      {/* Desktop — sidebar kiri */}
      <aside
        className="hidden lg:flex fixed left-3 sm:left-4 top-4 bottom-4 z-50 w-[4.25rem] flex-col items-center py-4 rounded-2xl border border-white/[0.1] bg-[#0f1524]/92 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65)]"
        aria-label="Navigasi utama"
      >
        <a
          href="#home"
          onClick={(e) => handleScroll(e, "home")}
          className="shrink-0 mb-4 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
          aria-label={`${site.brand} — beranda`}
        >
          <Image
            src={site.brandIcon}
            alt={site.brand}
            width={44}
            height={44}
            unoptimized
            className="h-11 w-11 object-contain rounded-xl"
            priority
          />
        </a>

        <nav className="flex flex-1 flex-col items-center justify-center gap-3 w-full px-2">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleScroll(e, link.id)}
                aria-label={link.label}
                aria-current={isActive ? "page" : undefined}
                title={link.label}
                className={iconLinkClass(isActive)}
              >
                <i className={`${link.icon} text-lg`} aria-hidden="true" />
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Mobile — hamburger tengah bawah */}
      <motion.div
        className="lg:hidden fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
        initial={false}
        animate={{ scale: menuOpen ? 0.96 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu navigasi"}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.12] bg-[#0f1524]/95 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.75)] text-white transition-colors hover:bg-[#151d30]"
        >
          <span className="relative flex h-5 w-6 flex-col items-center justify-center">
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-current"
              animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            />
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-current"
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-current"
              animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
              transition={{ duration: 0.22 }}
            />
          </span>
        </button>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Tutup menu"
              className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.nav
              id="mobile-nav-menu"
              aria-label="Menu navigasi mobile"
              className="lg:hidden fixed bottom-[5.25rem] left-1/2 z-50 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/[0.1] bg-[#0f1524]/98 backdrop-blur-2xl shadow-[0_16px_48px_-16px_rgba(0,0,0,0.85)] overflow-hidden"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.08]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Image
                  src={site.brandIcon}
                  alt={site.brand}
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 object-contain rounded-lg"
                />
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  <p className="font-bold text-white text-sm leading-tight">{site.brand}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Portfolio</p>
                </motion.div>
              </motion.div>

              <ul className="p-2 space-y-0.5">
                {navLinks.map((link, i) => {
                  const isActive = active === link.id;
                  return (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.04 }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => handleScroll(e, link.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={menuLinkClass(isActive)}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            isActive ? "bg-white text-[#0a0f1a]" : "bg-white/[0.06]"
                          }`}
                        >
                          <i className={`${link.icon} text-base`} aria-hidden="true" />
                        </span>
                        <span className="text-sm font-medium">{link.label}</span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
