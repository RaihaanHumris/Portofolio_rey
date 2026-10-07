"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { githubProfileUrl, navLinks, site } from "@/lib/site";

const social = [
  { label: "GitHub", href: githubProfileUrl(), icon: "fa-brands fa-github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/raihaanhumris", icon: "fa-brands fa-linkedin" },
  { label: "Email", href: `mailto:${site.email}`, icon: "fa-solid fa-envelope" },
];

export default function Footer() {
  return (
    <motion.footer
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative border-t border-white/[0.06] bg-surface-container-lowest"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />

      <motion.div className="container-site section-padding !py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-950 text-[10px] font-black">
                {site.shortName}
              </span>
              <span className="font-bold text-white">{site.brand}</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              {site.tagline} berbasis di {site.location}. Dibangun dengan fokus pada kualitas & performa.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-12">
            <motion.div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Navigasi</p>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Sosial</p>
              <ul className="space-y-2">
                {social.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <i className={`${item.icon} text-base w-4 text-center`} aria-hidden="true" />
                          <span>{item.label}</span>
                        </a>
                      </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500"
        >
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>Designed & built with Next.js</span>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
