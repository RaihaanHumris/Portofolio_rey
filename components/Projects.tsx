"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { githubProfileUrl, site } from "@/lib/site";
import { demoHostname, formatRepoTitle, type GitHubRepo } from "@/lib/github";

function formatPushedAt(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProjectSkeleton() {
  return (
    <div className="card-modern overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-white/[0.05]" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 rounded bg-white/[0.08]" />
        <div className="h-4 w-full rounded bg-white/[0.05]" />
        <div className="h-8 w-24 rounded-full bg-white/[0.06]" />
      </div>
    </div>
  );
}

type ProjectModalProps = {
  project: GitHubRepo;
  onClose: () => void;
};

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const tags = Array.from(new Set([
    ...(project.language ? [project.language] : []),
    ...(project.stack || []),
    ...(project.topics || []),
  ]));

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"
        aria-label="Tutup detail proyek"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/[0.1] bg-[#0c1220] shadow-2xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <span className="badge-label mb-3 inline-flex">Live demo</span>
              <h3 id="project-modal-title" className="text-2xl font-bold text-white leading-tight">
                {formatRepoTitle(project.name)}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-2">{demoHostname(project.homepage)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Tutup"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <p className="text-on-surface-variant text-base leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 border border-white/[0.08] bg-slate-900">
            <iframe
              src={project.homepage}
              title={`Live Demo of ${project.name}`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              allow="fullscreen"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-white/[0.08]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">star</span>
              {project.stars} stars
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">fork_right</span>
              {project.forks} forks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">update</span>
              {formatPushedAt(project.pushedAt)}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300 rounded-full bg-white/[0.06] border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm flex-1 justify-center"
            >
              Buka demo live
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </a>
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm flex-1 justify-center"
            >
              Lihat kode
              <span className="material-symbols-outlined text-lg">code</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [profileUrl, setProfileUrl] = useState(githubProfileUrl());
  const [username, setUsername] = useState(site.githubUsername);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GitHubRepo | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(silent = false) {
      try {
        const res = await fetch("/api/github/repos", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Gagal memuat proyek");
        }

        if (cancelled) return;

        setRepos(data.repos ?? []);
        setProfileUrl(data.profileUrl ?? githubProfileUrl());
        setUsername(data.username ?? site.githubUsername);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat proyek");
        }
      } finally {
        if (!cancelled && !silent) setLoading(false);
      }
    }

    load();

    const onVisible = () => {
      if (document.visibilityState === "visible") load(true);
    };

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") load(true);
    }, 60_000);

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <section id="projects" className="section-padding bg-surface-container-lowest overflow-hidden relative">
      <div className="container-site relative z-10">
        <SectionHeader
          label="Proyek"
          title="Demo Live"
          subtitle={`Proyek dengan website aktif · @${username}`}
        />

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="card-modern p-8 text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-slate-500 mb-3 block">
              cloud_off
            </span>
            <p className="text-on-surface-variant text-sm mb-4">{error}</p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex text-sm"
            >
              Buka GitHub
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </a>
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="card-modern p-8 text-center max-w-lg mx-auto">
            <p className="text-on-surface-variant text-sm mb-2">
              Belum ada repositori dengan demo live.
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Isi field <strong className="text-slate-400">Website</strong> di repositori GitHub
              (URL Vercel, Netlify, dll.) agar muncul di sini.
            </p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex text-sm"
            >
              Kelola di GitHub · @{username}
            </a>
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {repos.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelected(project)}
                  className="card-modern overflow-hidden flex flex-col text-left group transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    {/* Lightweight gradient preview instead of heavy iframe */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-900 to-slate-950">
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-white/10 group-hover:text-white/20 transition-colors duration-300">language</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-2 py-1 rounded-full shadow-lg">
                      Live
                    </span>
                    <span className="absolute bottom-3 left-3 right-3 text-[10px] font-mono text-slate-300 bg-slate-900/60 backdrop-blur-md px-2 py-1.5 rounded truncate border border-white/5">
                      {demoHostname(project.homepage)}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-slate-100">
                      {formatRepoTitle(project.name)}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                      {project.description}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-label">
                      Klik untuk detail →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex text-sm"
              >
                Semua repo · @{username}
                <span className="material-symbols-outlined text-lg">arrow_outward</span>
              </a>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
