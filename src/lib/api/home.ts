// lib/api/home.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised API service for the Home page.
// Replace each BASE_URL / endpoint with your real backend URLs.
// Every function throws on non-2xx so callers can handle errors uniformly.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  HeroContent,
  Step,
  Category,
  Freelancer,
  Feature,
  FooterContent,
  HomePageData,
} from "@/types/home";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.mysite.com";

// ── Helper ────────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Individual resource fetchers ──────────────────────────────────────────────

export const getHero        = ()          => apiFetch<HeroContent>("/home/hero");
export const getSteps       = ()          => apiFetch<Step[]>("/home/steps");
export const getCategories  = ()          => apiFetch<Category[]>("/home/categories");
export const getFreelancers = (limit = 4) => apiFetch<Freelancer[]>(`/freelancers?limit=${limit}&verified=true`);
export const getFeatures    = ()          => apiFetch<Feature[]>("/home/features");
export const getFooter      = ()          => apiFetch<FooterContent>("/home/footer");

// ── Aggregate fetcher (used in Next.js Server Component / getServerSideProps) ─

export async function getHomePageData(): Promise<HomePageData> {
  const [hero, steps, categories, freelancers, features, footer] =
    await Promise.all([
      getHero(),
      getSteps(),
      getCategories(),
      getFreelancers(4),
      getFeatures(),
      getFooter(),
    ]);

  return { hero, steps, categories, freelancers, features, footer };
}

// ── CTA actions ───────────────────────────────────────────────────────────────

export interface RegisterPayload {
  mode: "client" | "freelancer";
  email?: string;
}

export async function postRegister(payload: RegisterPayload): Promise<{ redirectUrl: string }> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}