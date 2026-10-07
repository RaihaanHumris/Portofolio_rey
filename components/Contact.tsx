"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import StaggerContainer from "./StaggerContainer";
import { fadeLeft, fadeRight, scaleIn } from "@/lib/animations";
import { site } from "@/lib/site";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    summary: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Terjadi kesalahan saat memproses permintaan Anda.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name" as const, label: "Nama", type: "text", placeholder: "Nama lengkap Anda" },
    { key: "email" as const, label: "Email", type: "email", placeholder: "email@contoh.com" },
  ];

  return (
    <section id="contact" className="section-padding bg-surface-container-low overflow-hidden relative">
      <motion.div className="container-site relative z-10">
        <SectionHeader
          label="Kontak"
          title="Mari Berkolaborasi"
          subtitle="Punya ide proyek? Kirim pesan dan kita diskusikan solusi terbaiknya."
          align="center"
        />

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-on-surface-variant leading-relaxed">
              Saya terbuka untuk proyek website, sistem web, dan kolaborasi jangka panjang. Respons biasanya dalam 24 jam.
            </p>

            <StaggerContainer className="space-y-3" stagger={0.08}>
              <motion.a
                variants={scaleIn}
                href={`mailto:${site.email}`}
                className="card-modern flex items-center gap-4 p-5 group"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white group-hover:bg-white group-hover:text-slate-950 transition-colors">
                  <i className="fa-solid fa-envelope text-lg" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <p className="font-semibold text-white text-sm break-all">{site.email}</p>
                </div>
              </motion.a>

              <motion.a
                variants={scaleIn}
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-modern flex items-center gap-4 p-5 group"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white group-hover:bg-[#25D366] transition-colors">
                  <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">WhatsApp</p>
                  <p className="font-semibold text-white text-sm">Chat langsung</p>
                </div>
              </motion.a>
            </StaggerContainer>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card-modern p-7 md:p-9 "
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <StaggerContainer stagger={0.08}>
                {fields.map((field) => (
                  <motion.div key={field.key} variants={scaleIn}>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      className="input-modern"
                      placeholder={field.placeholder}
                      required
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                  </motion.div>
                ))}

                <motion.div variants={scaleIn}>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Pesan</label>
                  <textarea
                    className="input-modern resize-y min-h-[120px]"
                    rows={4}
                    placeholder="Ceritakan tentang proyek Anda..."
                    required
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  />
                </motion.div>

                <motion.button
                  variants={scaleIn}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? "Memproses..." : "Kirim Pesan"}
                </motion.button>
              </StaggerContainer>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
