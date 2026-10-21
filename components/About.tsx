"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import StaggerContainer from "./StaggerContainer";
import CountUp from "./CountUp";
import FadeIn from "./FadeIn";
import ProfilePhoto from "./ProfilePhoto";
import { scaleIn } from "@/lib/animations";

export default function About() {
  const stats = [
    { value: 3, suffix: "+", label: "Tahun Pengalaman" },
    { value: 7, suffix: "+", label: "Proyek" },
    { value: 100, suffix: "%", label: "Kepuasan" },
  ];

  const tags = ["CORE_DEV", "FULLSTACK", "UI_BUILD"];

  return (
    <section id="about" className="section-padding bg-surface-container-low overflow-hidden relative section-mesh">
      <div className="container-site relative z-10">
        <SectionHeader
          label="Tentang Saya"
          title="Siapa Saya?"
          subtitle="Profil singkat & dedikasi dalam rekayasa web"
        />

        <motion.div
          className="glass-panel p-6 md:p-10"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn direction="left">
              <ProfilePhoto />
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                Halo, saya <strong className="text-white font-bold">Muhammad Raihaan Humris</strong>, seorang Web Developer yang berbasis di <strong className="text-white font-bold">Ende, Nusa Tenggara Timur</strong>. Sebagai peserta didik di <strong className="text-white font-bold">MAKN Ende</strong> jurusan <strong className="text-white font-bold">Pengembangan Perangkat Lunak dan Gim</strong>, saya memiliki dedikasi tinggi untuk terus mengeksplorasi teknologi terbaru.
              </p>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Saya percaya bahwa esensi dari seorang developer adalah kemampuannya dalam menghadirkan solusi yang efisien dan tepat sasaran. Dengan fokus pada penulisan kode yang bersih dan arsitektur sistem yang performan, saya siap membantu mentransformasi kebutuhan Anda menjadi aplikasi digital yang inovatif.
              </p>

              <StaggerContainer className="flex flex-wrap gap-3 mb-10" stagger={0.08}>
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    variants={scaleIn}
                    whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.35)" }}
                    className="px-3 py-1.5 rounded-full border border-white/15 text-[10px] font-bold tracking-widest text-white/80 bg-white/[0.04] backdrop-blur-sm"
                  >
                    {tag}
                  </motion.span>
                ))}
              </StaggerContainer>

              <StaggerContainer className="grid grid-cols-3 gap-6 md:gap-8" stagger={0.12}>
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={scaleIn}
                    className="card-modern p-5 text-center md:text-left"
                  >
                    <motion.div className="text-3xl md:text-4xl font-black text-white mb-2">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </motion.div>
                    <motion.div className="font-label text-[10px] uppercase tracking-widest text-slate-500">
                      {stat.label}
                    </motion.div>
                  </motion.div>
                ))}
              </StaggerContainer>
            </FadeIn>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
