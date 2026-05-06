// ─── middleware/routes.ts ─────────────────────────────────────────────────────
// Central source of truth for all route groups in the app.
// Referenced by middleware.ts for auth & role guards.

export const ROUTES = {

  // ── Public / Auth ──────────────────────────────────────────────────────────
  public: [
    '/',
    '/homepage',
    '/login',
    '/register',
    '/verify',
    '/forgot-password',
    '/change-password',
    '/profile-setup',
  ],

  // ── Dashboard ──────────────────────────────────────────────────────────────
  dashboard: [
    '/dashboard',
    '/client',
    '/freelancer',
    '/earnings',
  ],

  // ── Gigs ───────────────────────────────────────────────────────────────────
  gigs: [
    '/gigs',                    // listing
    '/gigs/[slug]',             // detail
    '/gigs/[slug]/analytics',   // analytics (freelancer only)
    '/gigs/[slug]/order',       // order page
    '/freelancer/create-gig',   // freelancer only
    '/freelancer/mygigs',       // freelancer only
  ],

  // ── Jobs ───────────────────────────────────────────────────────────────────
  jobs: [
    '/jobs',
    '/jobs/[id]',
    '/jobs/[id]/proposals',   // client only
    '/browsejob',
    '/postjob',               // client only
    '/jobdetails',
    '/submitproposal',        // freelancer only
    '/atsresult',
  ],

  // ── Orders & Payments ──────────────────────────────────────────────────────
  orders: [
    '/orders',
    '/orders/[id]',
    '/orders/[id]/active',
    '/orders/[id]/revision',
    '/completedorder',
    '/payment',
    '/escrow',
    '/financials',
  ],

  // ── Messages & Collaboration ───────────────────────────────────────────────
  messages: [
    '/messages',
    '/messages/[id]',
    '/collaboration',
    '/collaboration/hub',
  ],

  // ── Reviews ────────────────────────────────────────────────────────────────
  reviews: [
    '/reviews',
    '/reviews/leave-review',
    '/reviews/my-reviews',
  ],

  // ── User & Settings ────────────────────────────────────────────────────────
  settings: [
    '/settings',
    '/preferences',
    '/usermanagement',
    '/moderation',    // admin only
  ],

  // ── Other Pages ────────────────────────────────────────────────────────────
  other: [
    '/search',
    '/history',
    '/makecv',
    '/notifications',
    '/support',
    '/ai-interview',
  ],

  // ── API Routes (app/api/) ──────────────────────────────────────────────────
  api: [
    '/api/account',
    '/api/account/deactivate',
    '/api/ai-reply',
    '/api/analytics',
    '/api/auth/[...nextauth]',
    '/api/auth/password',
    '/api/change-password',
    '/api/dashboard/stats',
    '/api/download',
    '/api/financials',
    '/api/gigs',
    '/api/jobs',
    '/api/moderation',
    '/api/proposals',
    '/api/reviews',
    '/api/sessions',
    '/api/settings',
    '/api/team',
    '/api/users',
  ],

} as const

// ── Role-restricted routes ────────────────────────────────────────────────────

export const FREELANCER_ONLY = [
  '/freelancer/create-gig',
  '/freelancer/mygigs',
  '/gigs/[slug]/analytics',
  '/submitproposal',
  '/atsresult',
]

export const CLIENT_ONLY = [
  '/postjob',
  '/jobs/[id]/proposals',
  '/client',
]

export const ADMIN_ONLY = [
  '/moderation',
  '/api/moderation',
  '/usermanagement',
]