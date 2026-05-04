// hooks/useHomeData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Client-side hooks — use these inside "use client" components when you need
// live/refetched data. For SSR prefer getHomePageData() directly in the page.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  getHero,
  getSteps,
  getCategories,
  getFreelancers,
  getFeatures,
  getFooter,
} from "@/src/lib/api/home";
import type {
  HeroContent,
  Step,
  Category,
  Freelancer,
  Feature,
  FooterContent,
} from "@/src/types/home";

// ── Generic hook factory ──────────────────────────────────────────────────────

function useApiData<T>(fetcher: () => Promise<T>) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

// ── Named hooks ───────────────────────────────────────────────────────────────

export const useHero        = ()          => useApiData<HeroContent>(getHero);
export const useSteps       = ()          => useApiData<Step[]>(getSteps);
export const useCategories  = ()          => useApiData<Category[]>(getCategories);
export const useFeatures    = ()          => useApiData<Feature[]>(getFeatures);
export const useFooter      = ()          => useApiData<FooterContent>(getFooter);

export function useFreelancers(limit = 4) {
  return useApiData<Freelancer[]>(() => getFreelancers(limit));
}