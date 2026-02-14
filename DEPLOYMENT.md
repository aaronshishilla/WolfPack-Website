# Deploying to Cloudflare Pages

## Initial Setup

### 1. Connect GitHub Repository

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages > Create > Pages > Connect to Git**
3. Select the `WolfPack-Website` repository
4. Configure the build:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** Set `NODE_VERSION` environment variable to `20`

### 2. Environment Variables

In the Cloudflare Pages project settings, add these environment variables:

| Variable | Production Value | Preview Value |
|---|---|---|
| `PUBLIC_WORDPRESS_URL` | `https://admin.wolfpackadvising.com` | `https://admin.wolfpackadvising.com` |
| `PUBLIC_GRAPHQL_ENDPOINT` | `https://admin.wolfpackadvising.com/graphql` | `https://admin.wolfpackadvising.com/graphql` |
| `PUBLIC_SITE_URL` | `https://wolfpackadvising.com` | (auto-set by Cloudflare) |
| `NODE_VERSION` | `20` | `20` |

### 3. Custom Domain

1. In your Cloudflare Pages project, go to **Custom domains**
2. Add `wolfpackadvising.com` and `www.wolfpackadvising.com`
3. Cloudflare handles SSL automatically

---

## Automatic Deploys

Cloudflare Pages automatically builds and deploys:
- **Production:** on every push to `main`
- **Preview:** on every push to any other branch (generates a unique URL)

---

## Rebuilding After WordPress Content Changes

Since the site is statically generated at build time, you need to trigger a rebuild when content changes in WordPress. There are three approaches:

### Option A: Webhook (Recommended)

Create a Deploy Hook in Cloudflare Pages:
1. Go to your Pages project > **Settings > Builds & deployments > Deploy hooks**
2. Create a hook named "WordPress Content Update"
3. Copy the webhook URL

Then add this to WordPress `functions.php`:

```php
/**
 * Trigger Cloudflare Pages rebuild on publish/update.
 */
add_action('transition_post_status', function ($new_status, $old_status, $post) {
    if ($new_status !== 'publish') return;

    $webhook_url = 'YOUR_CLOUDFLARE_DEPLOY_HOOK_URL';

    wp_remote_post($webhook_url, [
        'method'  => 'POST',
        'timeout' => 5,
        'body'    => '',
    ]);
}, 10, 3);
```

### Option B: Scheduled Rebuilds

If content doesn't change frequently, schedule periodic rebuilds:
1. Use a cron service (Cloudflare Workers Cron, GitHub Actions, or cron-job.org)
2. Hit the deploy hook URL on a schedule (e.g., every 6 hours)

### Option C: Manual Rebuild

In the Cloudflare Pages dashboard, click **Retry deployment** on the latest deploy.

---

## Staging vs Production

| Environment | WordPress | Frontend |
|---|---|---|
| **Staging** | `admin.wolfpackadvising.com` | Cloudflare preview deploy (auto-generated URL) |
| **Production** | `admin.wolfpackadvising.com` | `wolfpackadvising.com` |

For a separate staging WordPress instance, create a second `.env` with different `PUBLIC_GRAPHQL_ENDPOINT` and set it in the Cloudflare preview environment variables.

---

## Build Performance

The site uses hybrid rendering:
- **SSG pages** (blog posts, services, case studies, team) are pre-built at deploy time for maximum performance
- **SSR pages** can be added for dynamic content that needs real-time data

Typical build: fetches all content from WordPress GraphQL, generates static HTML + CSS, outputs to `dist/`.

---

## Troubleshooting

### Build fails with GraphQL error
- Verify the WordPress GraphQL endpoint is accessible: `curl https://admin.wolfpackadvising.com/graphql`
- Check that WPGraphQL plugin is active
- Ensure custom post types have "Show in GraphQL" enabled

### CORS errors in development
- Add `http://localhost:4321` to the allowed origins in the WordPress CORS configuration
- See [WORDPRESS-SETUP.md](./WORDPRESS-SETUP.md#5-cors-configuration)

### Pages show empty content
- Verify posts/pages are published (not draft)
- Check that the GraphQL field names match what ACF is exposing
- Use the WPGraphQL IDE at `/graphql` to test queries directly

### Stale content after WordPress update
- Trigger a rebuild via deploy hook, manual redeploy, or git push
- For immediate updates, consider switching specific pages to SSR mode
