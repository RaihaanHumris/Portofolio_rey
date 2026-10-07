"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroTerminal from "./HeroTerminal";
import StaggerContainer from "./StaggerContainer";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import { site } from "@/lib/site";

const principles = [
  { title: "Struktur Jelas", desc: "Arsitektur rapi, mudah dikembangkan, minim bug.", icon: "fa-solid fa-network-wired" },
  { title: "Hasil Maksimal", desc: "Fokus performa dan tujuan bisnis yang jelas.", icon: "fa-solid fa-rocket" },
  { title: "Rencana Matang", desc: "Blueprint solid sebelum eksekusi kode.", icon: "fa-solid fa-layer-group" },
];

const tags = ["Next.js", "Laravel", "TypeScript", "Tailwind", "MySQL"];

const quickStats = [
  { value: "3+", label: "Tahun" },
  { value: "7+", label: "Proyek" },
  { value: "100%", label: "Dedikasi" },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
      <div className="section-padding pt-8 lg:pt-12 pb-16 relative z-10 flex-1 flex flex-col justify-center">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              variants={staggerContainer(0.08, 0.1)}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
                <span className="badge-label">Tersedia untuk proyek</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-headline text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mt-6 mb-5 leading-[1.05]"
              >
                {site.tagline}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-8"
              >
                Saya <strong className="text-white font-semibold">{site.name}</strong> — membangun
                website dan sistem web yang rapi, cepat, dan siap dipakai di produksi.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
                <Link href="#projects" className="btn-primary text-base flex items-center gap-2">
                  Lihat Proyek
                  <i className="fa-solid fa-arrow-up-right-from-square text-sm" aria-hidden="true" />
                </Link>
                <Link href="#contact" className="btn-secondary text-base">
                  Hubungi Saya
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 text-sm text-slate-400 rounded-lg border border-white/10 bg-white/[0.03]"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <StaggerContainer className="grid grid-cols-3 gap-3 max-w-md" stagger={0.1}>
                {quickStats.map((stat) => (
                  <motion.div key={stat.label} variants={scaleIn} className="card-modern p-4 text-center">
                    <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </StaggerContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md mx-auto lg:max-w-none w-full"
            >
              <HeroTerminal />
            </motion.div>
          </div>

          <div className="mt-20 md:mt-28">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-slate-500 mb-6"
            >
              Cara kerja saya
            </motion.p>
            <StaggerContainer className="grid sm:grid-cols-3 gap-4" stagger={0.1}>
              {principles.map((item) => (
                <motion.div
                  key={item.title}
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  className="card-modern p-6 md:p-7"
                >
                  <i className={`${item.icon} text-2xl text-slate-300 mb-3 block`} aria-hidden="true" />
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
