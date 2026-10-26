"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { githubProfileUrl, site } from "@/lib/site";
import {
  demoHostname,
  formatRepoTitle,
  type GitHubRepo,
  type ProjectCategory,
} from "@/lib/github";

const projectScreenshots: Record<string, string> = {
  "telda-app": "/Telda.png",
  inventori_lab_makn: "/InventarisLab.png",
};

const projectFilters: Array<{ label: string; value: ProjectCategory | "Semua" }> = [
  { label: "Semua", value: "Semua" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Fullstack", value: "Fullstack" },
];

function getProjectScreenshot(name: string) {
  return projectScreenshots[name.toLowerCase()];
}

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
  imageSrc,
  alt,
  className = "",
  showBrowserBar = true,
}: {
  url: string | null;
  imageSrc?: string;
  alt: string;
  className?: string;
  showBrowserBar?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [srcIndex, setSrcIndex] = useState(0);

  // Sumber screenshot otomatis dari web asli
  const screenshotSources = url
    ? [
        `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=960`,
        `https://image.thum.io/get/width/960/crop/600/noanimate/${url}`,
      ]
    : [];

  const currentSrc = imageSrc ?? screenshotSources[srcIndex];

  const handleImgError = () => {
    if (!imageSrc && srcIndex < screenshotSources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setStatus("error");
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}>
      {/* Top Browser Chrome Bar */}
      {showBrowserBar && url && (
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
      {status === "loading" && currentSrc && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 gap-2">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-slate-500" aria-hidden="true" />
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
            {imageSrc ? "Memuat screenshot..." : "Mengambil foto web..."}
          </span>
        </div>
      )}

      {/* Actual Website Screenshot Photo */}
      {status !== "error" && currentSrc ? (
        <Image
          src={currentSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
          onLoad={() => setStatus("loaded")}
          onError={handleImgError}
          className={`object-cover object-top transition-all duration-700 ${
            status === "loaded" ? "opacity-100 scale-100 group-hover:scale-105" : "opacity-0 scale-95"
          }`}
        />
      ) : (
        /* Fallback jika gagal mengambil screenshot */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-center">
          <i className="fa-solid fa-globe text-3xl text-slate-600 mb-2" aria-hidden="true" />
          <p className="text-xs text-slate-400 font-mono truncate max-w-[85%]">
            {url ? demoHostname(url) : "Screenshot proyek"}
          </p>
          <span className="text-[10px] text-slate-500 mt-1">
            {url ? "Live Website" : "Demo live belum tersedia"}
          </span>
        </div>
      )}

      {/* Overlay gradient untuk keterbacaan teks/badge di atasnya */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none z-10" />
    </div>
  );
}

type ProjectDetailProps = {
  project: GitHubRepo;
  onUnavailableDemo: () => void;
};

function ProjectDetail({ project, onUnavailableDemo }: ProjectDetailProps) {
  const [viewMode, setViewMode] = useState<"screenshot" | "iframe">("screenshot");
  const screenshot = getProjectScreenshot(project.name);

  const tags = Array.from(new Set([
    ...(project.language ? [project.language] : []),
    ...(project.stack || []),
    ...(project.topics || []),
  ]));

  return (
    <motion.article
      className="card-modern overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      aria-labelledby="project-detail-title"
    >
      <div className="p-5 sm:p-6">
        <div className="mb-5">
          <span className="badge-label mb-3 inline-flex">
            {project.homepage ? "Live demo" : "Demo belum tersedia"}
          </span>
          <h3 id="project-detail-title" className="text-2xl font-bold text-white leading-tight">
            {formatRepoTitle(project.name)}
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-2">
            {project.homepage ? demoHostname(project.homepage) : "Screenshot proyek dari GitHub"}
          </p>
        </div>

        {project.homepage && (
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-400">Tampilan:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("screenshot")}
                aria-pressed={viewMode === "screenshot"}
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
                aria-pressed={viewMode === "iframe"}
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
        )}

        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5 border border-white/[0.08] bg-slate-900 shadow-inner">
          {!project.homepage || viewMode === "screenshot" ? (
            <ProjectScreenshot
              url={project.homepage}
              imageSrc={screenshot}
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

        <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-5 pb-5 border-b border-white/[0.08]">
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-layer-group text-slate-400" aria-hidden="true" />
            {project.category}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-star text-amber-400" aria-hidden="true" />
            {project.stars} stars
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-clock-rotate-left text-slate-400" aria-hidden="true" />
            {formatPushedAt(project.pushedAt)}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
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
          {project.homepage ? (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm flex-1 justify-center flex items-center gap-2"
            >
              Buka demo live
              <i className="fa-solid fa-arrow-up-right-from-square text-sm" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              onClick={onUnavailableDemo}
              className="btn-primary text-sm flex-1 justify-center flex items-center gap-2"
            >
              Buka demo live
              <i className="fa-solid fa-circle-info text-sm" aria-hidden="true" />
            </button>
          )}
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
    </motion.article>
  );
}

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [profileUrl, setProfileUrl] = useState(githubProfileUrl());
  const [username, setUsername] = useState(site.githubUsername);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GitHubRepo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "Semua">("Semua");
  const [notification, setNotification] = useState<string | null>(null);
  const visibleRepos = selectedCategory === "Semua"
    ? repos
    : repos.filter((project) => project.category === selectedCategory);

  useEffect(() => {
    if (!selected && visibleRepos.length > 0) {
      setSelected(visibleRepos[0]);
    }
  }, [selected, visibleRepos]);

  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [notification]);

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
          title="Semua Proyek"
          subtitle={`Repositori publik dari GitHub · @${username}`}
        />

        {!loading && !error && repos.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2" aria-label="Filter kategori proyek">
            {projectFilters.map((filter) => {
              const count = filter.value === "Semua"
                ? repos.length
                : repos.filter((project) => project.category === filter.value).length;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(filter.value);
                    setSelected(null);
                  }}
                  aria-pressed={selectedCategory === filter.value}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === filter.value
                      ? "border-white bg-white text-slate-950"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 opacity-65">{count}</span>
                </button>
              );
            })}
          </div>
        )}

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
              Belum ada proyek yang bisa ditampilkan.
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Pastikan repositori proyek tersedia secara publik di GitHub.
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
            {visibleRepos.length > 0 ? (
              <div className="grid items-start gap-5 lg:grid-cols-[minmax(17rem,0.85fr)_minmax(0,1.5fr)]">
                <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                  {visibleRepos.map((project, index) => {
                    const isSelected = selected?.id === project.id;

                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setSelected(project)}
                        aria-pressed={isSelected}
                        className={`card-modern group flex w-full items-center gap-3 overflow-hidden p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                          isSelected
                            ? "border-white/30 bg-white/[0.1]"
                            : "hover:bg-white/[0.06]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-mono text-[10px] font-semibold text-slate-400"
                        >
                          {index + 1}
                        </span>
                        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-slate-900 sm:w-28">
                          <ProjectScreenshot
                            url={project.homepage}
                            imageSrc={getProjectScreenshot(project.name)}
                            alt={`Foto web ${formatRepoTitle(project.name)}`}
                            showBrowserBar={false}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="truncate text-sm font-bold text-white">
                              {formatRepoTitle(project.name)}
                            </h3>
                            <span
                              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                project.homepage ? "bg-emerald-400" : "bg-amber-300"
                              }`}
                              aria-label={project.homepage ? "Demo live tersedia" : "Demo live belum tersedia"}
                            />
                          </div>
                          <span className="mt-1 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-300">
                            {project.category}
                          </span>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                            {project.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="min-w-0">
                  <AnimatePresence mode="wait">
                    {selected ? (
                      <ProjectDetail
                        key={selected.id}
                        project={selected}
                        onUnavailableDemo={() => setNotification("Demo live belum tersedia untuk proyek ini.")}
                      />
                    ) : (
                      <motion.div
                        key="project-detail-placeholder"
                        className="card-modern flex min-h-72 flex-col items-center justify-center p-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <i className="fa-regular fa-hand-pointer mb-4 text-3xl text-slate-500" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-white">Pilih proyek</h3>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                          Klik salah satu proyek di daftar untuk melihat tampilan web dan deskripsinya di sini.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <p className="card-modern p-8 text-center text-sm text-on-surface-variant">
                Belum ada proyek dengan kategori {selectedCategory}.
              </p>
            )}

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

      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-xl border border-amber-400/30 bg-slate-900 px-4 py-3 text-sm text-white shadow-2xl"
        >
          <i className="fa-solid fa-circle-info text-amber-300" aria-hidden="true" />
          {notification}
        </div>
      )}
    </section>
  );
}
