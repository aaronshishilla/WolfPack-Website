# WolfPack Advising — Headless WordPress + Astro

A headless WordPress website for WolfPack Advising. WordPress handles content management, Astro generates the fast public-facing site, and Cloudflare Pages handles hosting.

## Architecture

```
┌──────────────────────┐     GraphQL      ┌──────────────────────┐
│   WordPress (Kinsta) │ ◄──────────────► │   Astro (Cloudflare) │
│ admin.wolfpack...com │    /graphql      │  wolfpackagency.co │
│                      │                  │                      │
│ - Content editing    │                  │ - Static pages (SSG) │
│ - ACF custom fields  │                  │ - Server routes (SSR)│
│ - Yoast SEO          │                  │ - Tailwind CSS       │
│ - Media library      │                  │ - Auto sitemap       │
└──────────────────────┘                  └──────────────────────┘
```

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Header.astro       # Site header + navigation (pulls from WP menus)
│   ├── Footer.astro       # Site footer
│   ├── SEOHead.astro      # Meta tags from Yoast SEO data
│   ├── PostCard.astro     # Blog post preview card
│   ├── ServiceCard.astro  # Service preview card
│   ├── TeamMemberCard.astro
│   └── TestimonialCard.astro
├── layouts/
│   └── BaseLayout.astro   # Main page layout (head, header, footer)
├── lib/
│   └── wordpress.ts       # GraphQL client + all WordPress queries
├── pages/
│   ├── index.astro        # Homepage
│   ├── blog/
│   │   ├── index.astro    # Blog listing
│   │   └── [slug].astro   # Individual blog post
│   ├── services/
│   │   ├── index.astro    # Services listing
│   │   └── [slug].astro   # Individual service page
│   ├── case-studies/
│   │   ├── index.astro    # Case studies listing
│   │   └── [slug].astro   # Individual case study
│   ├── team/
│   │   └── index.astro    # Team members grid
│   └── [...slug].astro    # Catch-all for WordPress pages
├── styles/
│   └── global.css         # Tailwind + brand tokens + WP content styles
└── types/
    └── wordpress.ts       # TypeScript interfaces for all WP content
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

| Variable | Description | Example |
|---|---|---|
| `PUBLIC_WORDPRESS_URL` | WordPress admin URL | `https://admin.wolfpackagency.co` |
| `PUBLIC_GRAPHQL_ENDPOINT` | WPGraphQL endpoint | `https://admin.wolfpackagency.co/graphql` |
| `PUBLIC_SITE_URL` | Public site URL | `https://wolfpackagency.co` |

## Content Types

| Content Type | WordPress CPT | Astro Route | ACF Fields |
|---|---|---|---|
| Blog Posts | `post` (built-in) | `/blog/[slug]` | None (uses standard fields) |
| Pages | `page` (built-in) | `/[...slug]` | None |
| Services | `service` | `/services/[slug]` | Description, icon, benefits, CTA |
| Case Studies | `case_study` | `/case-studies/[slug]` | Client info, challenge/solution/results, testimonial |
| Team Members | `team_member` | `/team` | Role, bio, LinkedIn, email, headshot, order |

## Adding a New Page Type

1. **Create the CPT in WordPress** — use ACF or CPT UI, ensure "Show in GraphQL" is enabled
2. **Define types** in `src/types/wordpress.ts`
3. **Add queries** in `src/lib/wordpress.ts`
4. **Create pages** in `src/pages/your-type/index.astro` and `[slug].astro`
5. **Build and deploy**

## Deployment to Cloudflare Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

### Quick Deploy

1. Connect this GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Cloudflare dashboard
5. Deploy

## WordPress Setup

See [WORDPRESS-SETUP.md](./WORDPRESS-SETUP.md) for the full guide on configuring WordPress plugins, custom post types, ACF fields, and CORS.

## Content Workflow

1. **Edit content** in WordPress at `admin.wolfpackagency.co/wp-admin`
2. **Publish or update** the post/page
3. **Trigger rebuild** — Cloudflare Pages rebuilds on git push, or set up a webhook for instant deploys (see DEPLOYMENT.md)
4. **Changes go live** on the public site after the build completes
