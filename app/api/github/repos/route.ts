import { NextResponse } from "next/server";
import { fetchGitHubRepos, getGitHubUsername } from "@/lib/github";
import { githubProfileUrl, site } from "@/lib/site";

/** Revalidate every 10 minutes; webhook can force-refresh sooner */
export const revalidate = 600;

export async function GET() {
  try {
    const repos = await fetchGitHubRepos(9);
    return NextResponse.json(
      {
        username: getGitHubUsername(),
        displayName: site.githubName,
        profileUrl: githubProfileUrl(getGitHubUsername()),
        repos,
        fetchedAt: new Date().toISOString(),
      },
    );
  } catch (error) {
    console.error("GitHub repos error:", error);
    return NextResponse.json(
      {
        error: "Gagal memuat repositori GitHub.",
        username: getGitHubUsername(),
        profileUrl: githubProfileUrl(getGitHubUsername()),
      },
      { status: 502 }
    );
  }
}
