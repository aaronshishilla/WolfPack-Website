# WordPress Setup Guide for Headless Architecture

This guide walks through configuring the WordPress backend at `admin.wolfpackadvising.com` to work as a headless CMS with the Astro frontend.

---

## 1. Required Plugins

Install and activate these plugins from the WordPress admin dashboard:

### WPGraphQL (Free)
- Go to **Plugins > Add New** and search for "WPGraphQL"
- Install and activate
- After activation, a new **GraphQL** menu appears in the sidebar
- Visit **GraphQL > Settings** and ensure:
  - "Enable GraphQL Endpoint" is checked
  - The endpoint path is `/graphql` (default)
- Test it: visit `https://admin.wolfpackadvising.com/graphql` in a browser — you should see the GraphQL IDE

### WPGraphQL for ACF (Free)
- Download from: https://github.com/wp-graphql/wpgraphql-acf
- Install via **Plugins > Upload Plugin**
- This exposes ACF fields in the GraphQL schema automatically

### ACF Pro
- Upload your licensed ACF Pro plugin ZIP via **Plugins > Upload Plugin**
- Activate and enter your license key under **Custom Fields > Updates**

### WPGraphQL Yoast SEO Addon (Free)
- Search for "Add WPGraphQL SEO" in **Plugins > Add New**
- This exposes Yoast SEO data in GraphQL queries

### Existing Plugins (Keep)
- **Yoast SEO** — works with the WPGraphQL addon above
- **Redirection** — continues to work for WordPress-side redirects
- **Better Search Replace** — utility plugin, no changes needed

---

## 2. Custom Post Types

Create these custom post types. You can use ACF Pro's "Post Types" feature (ACF 6.1+) or a plugin like Custom Post Type UI.

### Services
- **Post Type Key:** `service`
- **Slug:** `services`
- **Supports:** title, editor, thumbnail, excerpt, custom-fields
- **Show in GraphQL:** Yes (critical!)
- **GraphQL Single Name:** `service`
- **GraphQL Plural Name:** `services`

### Case Studies
- **Post Type Key:** `case_study`
- **Slug:** `case-studies`
- **Supports:** title, editor, thumbnail, excerpt, custom-fields
- **Show in GraphQL:** Yes
- **GraphQL Single Name:** `caseStudy`
- **GraphQL Plural Name:** `caseStudies`

### Team Members
- **Post Type Key:** `team_member`
- **Slug:** `team`
- **Supports:** title, editor, thumbnail, custom-fields
- **Show in GraphQL:** Yes
- **GraphQL Single Name:** `teamMember`
- **GraphQL Plural Name:** `teamMembers`

---

## 3. ACF Field Groups

### Service Fields
Assign to: Post Type = Service

| Field Name | Field Type | GraphQL Name |
|---|---|---|
| Service Description | Text Area | `serviceDescription` |
| Service Icon | Text | `serviceIcon` |
| Service Benefits | Repeater > Text | `serviceBenefits` |
| CTA Text | Text | `ctaText` |
| CTA Link | URL | `ctaLink` |

**Important:** In each field group's settings, ensure **"Show in GraphQL"** is set to **Yes**.

### Case Study Fields
Assign to: Post Type = Case Study

| Field Name | Field Type | GraphQL Name |
|---|---|---|
| Client Name | Text | `clientName` |
| Client Logo | Image | `clientLogo` |
| Challenge | WYSIWYG | `challenge` |
| Solution | WYSIWYG | `solution` |
| Results | WYSIWYG | `results` |
| Testimonial Quote | Text Area | `testimonialQuote` |
| Testimonial Author | Text | `testimonialAuthor` |
| Testimonial Role | Text | `testimonialRole` |

### Team Member Fields
Assign to: Post Type = Team Member

| Field Name | Field Type | GraphQL Name |
|---|---|---|
| Role / Title | Text | `role` |
| Bio | Text Area | `bio` |
| LinkedIn URL | URL | `linkedin` |
| Email | Email | `email` |
| Headshot | Image | `headshot` |
| Display Order | Number | `order` |

---

## 4. Navigation Menus

1. Go to **Appearance > Menus**
2. Create a menu named **Primary** (slug: `primary`)
3. Add your pages/links to the menu
4. WPGraphQL exposes menus automatically — the Astro frontend queries for the menu by slug

---

## 5. CORS Configuration

Since the Astro frontend runs on a different domain, WordPress needs to allow cross-origin requests.

Add this to your theme's `functions.php` or a custom plugin:

```php
<?php
/**
 * Enable CORS for headless frontend.
 * Add to functions.php or a custom mu-plugin.
 */
add_action('init', function () {
    $allowed_origins = [
        'https://wolfpackadvising.com',
        'https://staging.wolfpackadvising.com',
        'http://localhost:4321', // Astro dev server
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed_origins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
});
```

---

## 6. Permalink Settings

1. Go to **Settings > Permalinks**
2. Set to **Post name** (`/%postname%/`)
3. Save changes — this ensures clean URLs

---

## 7. Testing the GraphQL Endpoint

After installing WPGraphQL, visit:
```
https://admin.wolfpackadvising.com/graphql
```

Try this test query in the GraphQL IDE:
```graphql
{
  posts(first: 3) {
    nodes {
      title
      slug
      date
    }
  }
  generalSettings {
    title
    url
  }
}
```

You should see your site's posts and settings returned as JSON.

---

## 8. WordPress Security for Headless

Since the public doesn't visit the WordPress frontend:

1. **Block public access to WP frontend** (optional) — use Kinsta's password protection or redirect all non-`/wp-admin` and non-`/graphql` traffic
2. **Keep WordPress updated** — Kinsta handles core updates, but stay on top of plugin updates
3. **Use strong passwords** and consider 2FA for admin accounts
4. **Limit WPGraphQL introspection** in production — in **GraphQL > Settings**, you can disable introspection for non-authenticated users
