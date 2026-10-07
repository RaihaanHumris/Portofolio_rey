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

/**
 * Komponen untuk menampilkan screenshot / foto website yang otomatis
 * diambil dari alamat web aslinya menggunakan automated screenshot service.
 */
function ProjectScreenshot({
  url,
  alt,
  className = "",
  showBrowserBar = true,
}: {
  url: string;
  alt: string;
  className?: string;
  showBrowserBar?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [srcIndex, setSrcIndex] = useState(0);

  // Sumber screenshot otomatis dari web asli
  const screenshotSources = [
    `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=960`,
    `https://image.thum.io/get/width/960/crop/600/noanimate/${url}`,
  ];

  const currentSrc = screenshotSources[srcIndex];

  const handleImgError = () => {
    if (srcIndex < screenshotSources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setStatus("error");
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}>
      {/* Top Browser Chrome Bar */}
      {showBrowserBar && (
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-950/85 backdrop-blur-md flex items-center px-2.5 gap-1.5 z-20 border-b border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
          <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
          <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[9px] font-mono text-slate-400 truncate opacity-75">
            {demoHostname(url)}
          </span>
        </div>
      )}

      {/* Loading Skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 gap-2">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-slate-500" aria-hidden="true" />
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
            Mengambil foto web...
          </span>
        </div>
      )}

      {/* Actual Website Screenshot Photo */}
      {status !== "error" ? (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={handleImgError}
          className={`w-full h-full object-cover object-top transition-all duration-700 ${
            status === "loaded" ? "opacity-100 scale-100 group-hover:scale-105" : "opacity-0 scale-95"
          }`}
        />
      ) : (
        /* Fallback jika gagal mengambil screenshot */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-center">
          <i className="fa-solid fa-globe text-3xl text-slate-600 mb-2" aria-hidden="true" />
          <p className="text-xs text-slate-400 font-mono truncate max-w-[85%]">{demoHostname(url)}</p>
          <span className="text-[10px] text-slate-500 mt-1">Live Website</span>
        </div>
      )}

      {/* Overlay gradient untuk keterbacaan teks/badge di atasnya */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none z-10" />
    </div>
  );
}

type ProjectModalProps = {
  project: GitHubRepo;
  onClose: () => void;
};

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [viewMode, setViewMode] = useState<"screenshot" | "iframe">("screenshot");

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
        className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/[0.1] bg-[#0c1220] shadow-2xl"
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
              <i className="fa-solid fa-xmark text-lg" aria-hidden="true" />
            </button>
          </div>

          <p className="text-on-surface-variant text-base leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Toggle View Mode */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Tampilan Demo:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("screenshot")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === "screenshot"
                    ? "bg-white text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-image text-xs" aria-hidden="true" />
                Foto Web
              </button>
              <button
                type="button"
                onClick={() => setViewMode("iframe")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === "iframe"
                    ? "bg-white text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-laptop text-xs" aria-hidden="true" />
                Interaktif
              </button>
            </div>
          </div>

          {/* Screenshot Photo or Interactive Iframe */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 border border-white/[0.08] bg-slate-900 shadow-inner">
            {viewMode === "screenshot" ? (
              <ProjectScreenshot
                url={project.homepage}
                alt={`Screenshot ${project.name}`}
                showBrowserBar={true}
              />
            ) : (
              <iframe
                src={project.homepage}
                title={`Live Demo of ${project.name}`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                allow="fullscreen"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-white/[0.08]">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-star text-amber-400 text-sm" aria-hidden="true" />
              {project.stars} stars
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-code-fork text-slate-400 text-sm" aria-hidden="true" />
              {project.forks} forks
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-clock-rotate-left text-slate-400 text-sm" aria-hidden="true" />
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
              className="btn-primary text-sm flex-1 justify-center flex items-center gap-2"
            >
              Buka demo live
              <i className="fa-solid fa-arrow-up-right-from-square text-sm" aria-hidden="true" />
            </a>
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm flex-1 justify-center flex items-center gap-2"
            >
              Lihat kode
              <i className="fa-solid fa-code text-sm" aria-hidden="true" />
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
            <i className="fa-solid fa-cloud-arrow-down text-3xl text-slate-500 mb-3 block" aria-hidden="true" />
            <p className="text-on-surface-variant text-sm mb-4">{error}</p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex text-sm items-center gap-2"
            >
              Buka GitHub
              <i className="fa-solid fa-arrow-up-right-from-square text-sm" aria-hidden="true" />
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
                    {/* Foto Project Otomatis Diambil dari Web Aslinya */}
                    <ProjectScreenshot
                      url={project.homepage}
                      alt={`Foto web ${formatRepoTitle(project.name)}`}
                    />

                    {/* Live Badge */}
                    <span className="absolute top-8 left-3 z-20 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-500/25 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>

                    {/* Hostname Badge */}
                    <span className="absolute bottom-3 left-3 right-3 z-20 text-[10px] font-mono text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg truncate border border-white/10 flex items-center gap-1.5">
                      <i className="fa-solid fa-link text-[10px] text-slate-400" aria-hidden="true" />
                      <span className="truncate">{demoHostname(project.homepage)}</span>
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-slate-100">
                      {formatRepoTitle(project.name)}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                      {project.description}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-label flex items-center gap-1.5">
                      Klik untuk detail
                      <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
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
                className="btn-secondary inline-flex text-sm items-center gap-2"
              >
                Semua repo · @{username}
                <i className="fa-solid fa-arrow-up-right-from-square text-sm" aria-hidden="true" />
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
