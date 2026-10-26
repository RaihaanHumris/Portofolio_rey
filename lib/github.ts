import { site } from "@/lib/site";

export type GitHubRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  category: ProjectCategory;
  topics: string[];
  stack: string[];
  stars: number;
  forks: number;
  pushedAt: string;
};

export type ProjectCategory = "Frontend" | "Backend" | "Fullstack" | "Lainnya";

type GitHubApiRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
  default_branch: string;
};

export function getGitHubUsername() {
  return process.env.GITHUB_USERNAME?.trim() || site.githubUsername;
}

export function formatRepoTitle(name: string) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Hanya URL http(s) valid — dipakai sebagai live demo di GitHub Homepage field */
export function normalizeLiveDemoUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  if (trimmed === "#") return null;

  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export function demoHostname(homepage: string) {
  try {
    return new URL(homepage).hostname.replace(/^www\./, "");
  } catch {
    return homepage;
  }
}

function inferProjectCategory(language: string | null, stack: string[], description: string): ProjectCategory {
  const frontendStack = [
    "react",
    "next.js",
    "vue",
    "svelte",
    "angular",
    "tailwind css",
    "bootstrap",
    "three.js",
    "vite",
    "framer motion",
  ];
  const backendStack = ["express", "prisma"];
  const normalizedStack = stack.map((item) => item.toLowerCase());
  const normalizedLanguage = language?.toLowerCase() ?? "";
  const normalizedDescription = description.toLowerCase();
  const hasBackendStack = backendStack.some((item) => normalizedStack.includes(item));
  const hasBackendLanguage = ["php", "python", "go", "java", "ruby", "rust", "c#"].includes(normalizedLanguage);
  const hasFrontendFramework = frontendStack.some((item) => normalizedStack.includes(item));
  const hasFrontendLanguage = ["html", "css", "javascript", "typescript", "blade", "kotlin"].includes(normalizedLanguage);

  const hasFrontend =
    hasFrontendFramework ||
    (hasFrontendLanguage && !hasBackendStack && !hasBackendLanguage);
  const hasBackend =
    hasBackendStack ||
    hasBackendLanguage ||
    /\b(backend|back-end|api|server)\b/.test(normalizedDescription);

  if (normalizedStack.includes("next.js") || normalizedLanguage === "blade") return "Fullstack";
  if (hasFrontend && hasBackend) return "Fullstack";
  if (hasFrontend) return "Frontend";
  if (hasBackend) return "Backend";
  return "Lainnya";
}

export async function fetchGitHubRepos(limit = 100): Promise<GitHubRepo[]> {
  const username = getGitHubUsername();
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "reydev-portfolio",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100&type=owner`,
    { headers, next: { revalidate: 600 } }
  );

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }

  const data = (await res.json()) as GitHubApiRepo[];

  const validRepos = data
    .filter((repo) => !repo.fork && !repo.archived && !repo.private)
    .map((repo) => {
      const homepage = normalizeLiveDemoUrl(repo.homepage);
      return { repo, homepage };
    })
    .slice(0, limit);

  const repos = await Promise.all(
    validRepos.map(async ({ repo, homepage }) => {
      const stack: string[] = [];
      const githubDescription = repo.description?.trim();
      let description = githubDescription || "Proyek web di GitHub.";

      try {
        const pkgRes = await fetch(
          `https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/package.json`
        );

        if (pkgRes.ok) {
          const pkg = await pkgRes.json();
          const deps = { ...pkg.dependencies, ...pkg.devDependencies };
          if (deps['react']) stack.push('React');
          if (deps['next']) stack.push('Next.js');
          if (deps['vue']) stack.push('Vue');
          if (deps['svelte']) stack.push('Svelte');
          if (deps['@angular/core']) stack.push('Angular');
          if (deps['tailwindcss']) stack.push('Tailwind CSS');
          if (deps['typescript']) stack.push('TypeScript');
          if (deps['express']) stack.push('Express');
          if (deps['prisma']) stack.push('Prisma');
          if (deps['vite']) stack.push('Vite');
          if (deps['bootstrap']) stack.push('Bootstrap');
          if (deps['framer-motion']) stack.push('Framer Motion');
          if (deps['three']) stack.push('Three.js');
        }

        if (!githubDescription) {
          const readmeRes = await fetch(
            `https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/README.md`
          );
          if (readmeRes.ok) {
            const readme = await readmeRes.text();
            const lines = readme.split('\n');
            for (const line of lines) {
              const t = line.trim();
              // find the first readable paragraph that is not a heading, image, or link-only
              if (t && !t.startsWith('#') && !t.startsWith('[') && !t.startsWith('<') && !t.startsWith('!') && !t.startsWith('=')) {
                if (t.length > 30) { // sufficiently long to be a description
                  description = t.length > 200 ? t.slice(0, 197) + '...' : t;
                  break;
                }
              }
            }
          }
        }
      } catch (err) {
        // ignore fetch errors for raw files
      }

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description,
        htmlUrl: repo.html_url,
        homepage,
        language: repo.language,
        category: inferProjectCategory(repo.language, stack, description),
        topics: (repo.topics ?? []).slice(0, 4),
        stack,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        pushedAt: repo.pushed_at,
      };
    })
  );

  return repos;
}
