/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WORDPRESS_URL: string;
  readonly PUBLIC_GRAPHQL_ENDPOINT: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PREVIEW_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
