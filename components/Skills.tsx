"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import StaggerContainer from "./StaggerContainer";
import { scaleIn } from "@/lib/animations";

export default function Skills() {
  const programAndFrameworks = [
    { icon: "fa-brands fa-html5 text-orange-500", name: "HTML" },
    { icon: "fa-brands fa-css3-alt text-blue-500", name: "CSS" },
    { icon: "fa-brands fa-js text-yellow-400", name: "JavaScript" },
    { icon: "fa-brands fa-php text-indigo-400", name: "PHP" },
    { icon: "fa-brands fa-laravel text-red-500", name: "Laravel" },
    { icon: "fa-brands fa-node-js text-emerald-500", name: "Node.js" },
  ];

  const toolsAndLibraries = [
    { icon: "fa-solid fa-database text-sky-400", name: "MySQL" },
    { icon: "fa-brands fa-wordpress text-blue-400", name: "WordPress" },
    { icon: "fa-brands fa-git-alt text-orange-600", name: "Git" },
    { icon: "fa-solid fa-wind text-teal-400", name: "Tailwind CSS" },
  ];

  const renderGrid = (items: typeof programAndFrameworks) => (
    <StaggerContainer className="grid grid-cols-2 gap-3" stagger={0.06}>
      {items.map((skill) => (
        <motion.div
          key={skill.name}
          variants={scaleIn}
          whileHover={{ y: -4 }}
          className="card-modern p-5 md:p-6 flex flex-col items-start group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] mb-3 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all">
            <i className={`${skill.icon} text-2xl md:text-3xl`} aria-hidden="true" />
          </div>
          <span className="font-semibold text-white text-sm md:text-base">{skill.name}</span>
        </motion.div>
      ))}
    </StaggerContainer>
  );

  return (
    <section id="skills" className="section-padding overflow-hidden relative">
      <motion.div className="container-site relative z-10">
        <SectionHeader
          label="Keahlian"
          title="Tech Stack"
          subtitle="Teknologi yang saya gunakan untuk membangun produk digital"
        />

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              Bahasa & Framework
            </h3>
            {renderGrid(programAndFrameworks)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              Tools & Database
            </h3>
            {renderGrid(toolsAndLibraries)}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
