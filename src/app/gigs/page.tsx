"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  defaultGigsFilters,
  DeliveryOption,
  filterAndSortGigs,
  gigsCategories,
  Gig,
  GigCategory,
  GigsFilters,
  MinRatingOption,
  mockGigs,
  SellerLevel,
  ServiceInclude,
}from  "../../lib/gigs-api";

const DELIVERY_OPTIONS: DeliveryOption[] = [
  "Express (24 hrs)",
  "Up to 3 days",
  "Up to 7 days",
  "Anytime",
];

const SELLER_LEVELS: SellerLevel[] = [
  "Top Rated",
  "AI Verified",
  "New Seller",
];

const MIN_RATINGS: MinRatingOption[] = [
  "4.5+ stars",
  "4.0+ stars",
  "3.5+ stars",
  "Any rating",
];

const SERVICE_INCLUDES: ServiceInclude[] = [
  "Revisions included",
  "Source files",
  "Commercial use",
];

function Badge({
  text,
  variant,
}: {
  text: string;
  variant: "purple" | "orange";
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
        variant === "purple" ? "bg-violet-600" : "bg-amber-500"
      }`}
    >
      {text}
    </span>
  );
}

function FilterCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[16px] text-slate-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded border-slate-300"
      />
      <span>{label}</span>
    </label>
  );
}

export default function GigsPage() {
  const [filters, setFilters] = useState<GigsFilters>(defaultGigsFilters);
  const [heroSearch, setHeroSearch] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const perPage = 6;

  const filteredGigs = useMemo(() => {
    return filterAndSortGigs(mockGigs, filters);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredGigs.length / perPage));

  const visibleGigs = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredGigs.slice(start, start + perPage);
  }, [filteredGigs, page]);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: heroSearch,
    }));
    setPage(1);
  };

  const handleCategoryChange = (category: GigCategory) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
    setPage(1);
  };

  const toggleFavorite = (gigId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(gigId)
        ? prev.filter((id) => id !== gigId)
        : [...prev, gigId]
    );
  };

  const toggleMultiSelect = <T extends string>(
    value: T,
    current: T[],
    key: keyof GigsFilters
  ) => {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setFilters((prev) => ({
      ...prev,
      [key]: next,
    }));
    setPage(1);
  };

  const handleClearAll = () => {
    setFilters(defaultGigsFilters);
    setHeroSearch("");
    setPage(1);
  };

  const renderGigCard = (gig: Gig) => {
    const isFavorite = favoriteIds.includes(gig.id);

    return (
      <div
        key={gig.id}
        className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        <Link href={`/gigs/${gig.slug}`} className="relative block h-[200px]">
          <img
            src={gig.image}
            alt={gig.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://picsum.photos/id/1067/900/500";
            }}
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {gig.aiVerified ? <Badge text="AI Verified" variant="purple" /> : null}
            {gig.topRated ? <Badge text="Top Rated" variant="orange" /> : null}
          </div>
        </Link>

        <button
          onClick={() => toggleFavorite(gig.id)}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow"
        >
          <Heart
            className={`h-6 w-6 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-500"
            }`}
          />
        </button>

        <div className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={gig.sellerAvatar}
                alt={gig.sellerName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-[15px] font-semibold text-slate-900">
                {gig.sellerName}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[15px] font-semibold text-slate-900">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{gig.rating}</span>
            </div>
          </div>

          <Link
            href={`/gigs/${gig.slug}`}
            className="block min-h-[54px] text-[16px] font-semibold leading-6 text-slate-900"
          >
            {gig.title}
          </Link>

          <div className="mt-4">
            <p className="text-[13px] uppercase tracking-wide text-slate-400">
              Starting at
            </p>
            <p className="mt-1 text-[22px] font-bold text-slate-900">
              ${gig.price}
            </p>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-[15px] text-slate-500">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-900">{gig.rating}</span>
                <span>({gig.reviewsCount})</span>
              </div>

              <button
                onClick={() => toggleFavorite(gig.id)}
                className="flex items-center gap-2"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400"
                  }`}
                />
                <span>{(gig.likesCount / 1000).toFixed(1)}K</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8]">

      <section className="bg-gradient-to-r from-fuchsia-600 to-blue-500 px-4 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-[1200px] text-center">
          <h1 className="text-5xl font-bold text-white md:text-[58px]">
            Discover Freelance Services
          </h1>

          <p className="mt-5 text-[22px] text-white/90">
            Browse thousands of professional services from verified freelancers
          </p>

          <div className="mx-auto mt-10 flex max-w-[900px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
            <div className="flex flex-1 items-center gap-4 px-6">
              <Search className="h-7 w-7 text-slate-400" />
              <input
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search for services (e.g., logo design, web development...)"
                className="h-[74px] w-full border-none bg-transparent text-[22px] outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-600 px-10 text-[22px] font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] overflow-x-auto px-4 py-6 md:px-8">
          <div className="flex min-w-max items-center gap-8">
            {gigsCategories.map((category) => {
              const active = filters.category === category;

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`border-b-2 pb-3 text-[18px] font-medium ${
                    active
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-slate-600"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-slate-900">Filters</h2>
              <button
                onClick={handleClearAll}
                className="text-[16px] font-medium text-blue-500"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-[17px] font-medium text-slate-900">
                  Budget (USD)
                </h3>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minBudget: Number(e.target.value) || 0,
                      }))
                    }
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-[16px] outline-none"
                  />

                  <input
                    type="number"
                    value={filters.maxBudget}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxBudget: Number(e.target.value) || 0,
                      }))
                    }
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-[16px] outline-none"
                  />
                </div>

                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={50}
                  value={filters.maxBudget}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxBudget: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <h3 className="mb-4 text-[17px] font-medium text-slate-900">
                  Delivery Time
                </h3>

                <div className="space-y-4">
                  {DELIVERY_OPTIONS.map((option) => (
                    <FilterCheckbox
                      key={option}
                      label={option}
                      checked={filters.deliveryOptions.includes(option)}
                      onChange={() =>
                        toggleMultiSelect(
                          option,
                          filters.deliveryOptions,
                          "deliveryOptions"
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-[17px] font-medium text-slate-900">
                  Seller Level
                </h3>

                <div className="space-y-4">
                  {SELLER_LEVELS.map((level) => (
                    <FilterCheckbox
                      key={level}
                      label={level}
                      checked={filters.sellerLevels.includes(level)}
                      onChange={() =>
                        toggleMultiSelect(
                          level,
                          filters.sellerLevels,
                          "sellerLevels"
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-[17px] font-medium text-slate-900">
                  Minimum Rating
                </h3>

                <div className="space-y-4">
                  {MIN_RATINGS.map((rating) => (
                    <label
                      key={rating}
                      className="flex cursor-pointer items-center gap-3 text-[16px]"
                    >
                      <input
                        type="radio"
                        name="minRating"
                        checked={filters.minRating === rating}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            minRating: rating,
                          }))
                        }
                        className="h-4 w-4"
                      />
                      <span>{rating}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-[17px] font-medium text-slate-900">
                  Service Includes
                </h3>

                <div className="space-y-4">
                  {SERVICE_INCLUDES.map((item) => (
                    <FilterCheckbox
                      key={item}
                      label={item}
                      checked={filters.serviceIncludes.includes(item)}
                      onChange={() =>
                        toggleMultiSelect(
                          item,
                          filters.serviceIncludes,
                          "serviceIncludes"
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-[26px] font-bold text-slate-900">
                {filteredGigs.length.toLocaleString()} services available
              </h2>

              <div className="relative w-full md:w-[300px]">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as GigsFilters["sortBy"],
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pr-12 text-[16px] outline-none"
                >
                  <option>Recommended</option>
                  <option>Lowest Price</option>
                  <option>Highest Rating</option>
                  <option>Most Popular</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleGigs.map(renderGigCard)}
            </div>

            {filteredGigs.length === 0 && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-xl text-slate-500 shadow-sm">
                No services found for the selected filters.
              </div>
            )}

            {filteredGigs.length > 0 && (
              <div className="mt-10 flex items-center justify-center gap-5">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 text-[20px] font-medium text-slate-900 disabled:opacity-40"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                    const pageNumber = i + 1;
                    const active = pageNumber === page;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-[17px] ${
                          active
                            ? "bg-slate-100 font-bold text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  {totalPages > 5 && <span className="px-2 text-[18px]">...</span>}
                </div>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-2 text-[20px] font-medium text-slate-900 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}