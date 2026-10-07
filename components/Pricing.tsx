"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import StaggerContainer from "./StaggerContainer";
import { scaleIn } from "@/lib/animations";

export default function Pricing() {
  const tiers = [
    {
      label: "Starter",
      title: "Landing Page",
      desc: "Halaman web statis yang menarik untuk promosi atau portofolio.",
      price: "Rp 1.000.000",
      features: ["Landing page responsif", "Desain UI modern", "Integrasi konten"],
      cta: "Mulai Proyek",
      highlight: false,
    },
    {
      label: "Populer",
      title: "Web App & Dashboard",
      desc: "Sistem web lengkap dengan frontend, backend, dan panel admin.",
      price: "Rp 3.500.000",
      features: ["Fullstack development", "Dashboard interaktif", "Deployment dasar"],
      cta: "Mulai Proyek",
      highlight: true,
    },
    {
      label: "Enterprise",
      title: "Full App & Web",
      desc: "Sistem berskala besar dengan infrastruktur dan dukungan premium.",
      price: "Rp 7.000.000",
      features: ["Arsitektur scalable", "Dukungan premium", "Jaminan performa"],
      cta: "Hubungi Saya",
      highlight: false,
    },
  ];

  return (
    <section className="section-padding bg-surface overflow-hidden relative">
      <motion.div className="container-site relative z-10">
        <SectionHeader
          label="Layanan"
          title="Paket Harga"
          subtitle="Investasi transparan untuk setiap kebutuhan proyek Anda"
          align="center"
        />

        <StaggerContainer className="grid md:grid-cols-3 gap-5" stagger={0.1}>
          {tiers.map((tier) => (
            <motion.div
              key={tier.title}
              variants={scaleIn}
              whileHover={{ y: -6 }}
              className={`card-modern p-8 md:p-9 flex flex-col relative ${
                tier.highlight ? "ring-1 ring-white/25 bg-white/[0.05]" : ""
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white text-slate-950 rounded-full">
                  Rekomendasi
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">{tier.label}</p>
              <h3 className="text-2xl font-bold text-white mb-2">{tier.title}</h3>
              <p className="text-on-surface-variant text-sm mb-6">{tier.desc}</p>
              <p className="text-3xl font-black text-white mb-6">
                {tier.price}
                <span className="text-sm font-normal text-slate-500"> / mulai</span>
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <i className="fa-solid fa-circle-check text-secondary text-base" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={tier.highlight ? "btn-primary w-full" : "btn-secondary w-full"}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </StaggerContainer>
      </motion.div>
    </section>
  );
}
