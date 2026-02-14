import { GraphQLClient, gql } from "graphql-request";
import type {
  WPPost,
  WPPage,
  WPService,
  WPCaseStudy,
  WPTeamMember,
  WPMenu,
  WPMenuItem,
  PostsResponse,
  PostResponse,
  PagesResponse,
  PageResponse,
  MenuResponse,
} from "@/types/wordpress";

/* ============================================
   GraphQL Client Setup
   ============================================ */

const endpoint =
  import.meta.env.PUBLIC_GRAPHQL_ENDPOINT ||
  "https://admin.wolfpackagency.co/graphql";

const client = new GraphQLClient(endpoint);

/* ============================================
   Shared Fragments
   ============================================ */

const SEO_FRAGMENT = gql`
  fragment SeoFields on PostTypeSEO {
    title
    metaDesc
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
      altText
    }
    canonical
  }
`;

const FEATURED_IMAGE_FRAGMENT = gql`
  fragment FeaturedImageFields on NodeWithFeaturedImageToMediaItemConnectionEdge {
    node {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

/* ============================================
   Posts
   ============================================ */

export async function getPosts(
  first: number = 10,
  after?: string
): Promise<{ posts: WPPost[]; hasNextPage: boolean; endCursor: string }> {
  const query = gql`
    ${SEO_FRAGMENT}
    ${FEATURED_IMAGE_FRAGMENT}
    query GetPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          uri
          date
          modified
          excerpt
          featuredImage {
            ...FeaturedImageFields
          }
          categories {
            nodes {
              name
              slug
              uri
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          seo {
            ...SeoFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await client.request<PostsResponse>(query, { first, after });
  return {
    posts: data.posts.nodes,
    hasNextPage: data.posts.pageInfo.hasNextPage,
    endCursor: data.posts.pageInfo.endCursor,
  };
}

export async function getPostBySlug(
  slug: string
): Promise<WPPost | null> {
  const query = gql`
    ${SEO_FRAGMENT}
    ${FEATURED_IMAGE_FRAGMENT}
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        slug
        uri
        date
        modified
        excerpt
        content
        featuredImage {
          ...FeaturedImageFields
        }
        categories {
          nodes {
            name
            slug
            uri
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        seo {
          ...SeoFields
        }
      }
    }
  `;

  const data = await client.request<PostResponse>(query, { slug });
  return data.post ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const query = gql`
    query GetAllPostSlugs {
      posts(first: 1000, where: { status: PUBLISH }) {
        nodes {
          slug
        }
      }
    }
  `;

  const data = await client.request<PostsResponse>(query);
  return data.posts.nodes.map((post) => post.slug);
}

/* ============================================
   Pages
   ============================================ */

export async function getPageBySlug(
  slug: string
): Promise<WPPage | null> {
  const query = gql`
    ${SEO_FRAGMENT}
    ${FEATURED_IMAGE_FRAGMENT}
    query GetPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        slug
        uri
        content
        date
        modified
        featuredImage {
          ...FeaturedImageFields
        }
        seo {
          ...SeoFields
        }
      }
    }
  `;

  const data = await client.request<PageResponse>(query, { slug });
  return data.page ?? null;
}

export async function getAllPages(): Promise<WPPage[]> {
  const query = gql`
    ${SEO_FRAGMENT}
    query GetAllPages {
      pages(first: 100, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          uri
          content
          date
          modified
          seo {
            ...SeoFields
          }
        }
      }
    }
  `;

  const data = await client.request<PagesResponse>(query);
  return data.pages.nodes;
}

/* ============================================
   Services (Custom Post Type with ACF)
   ============================================ */

export async function getServices(): Promise<WPService[]> {
  const query = gql`
    ${SEO_FRAGMENT}
    ${FEATURED_IMAGE_FRAGMENT}
    query GetServices {
      services(first: 100, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          uri
          content
          featuredImage {
            ...FeaturedImageFields
          }
          serviceFields {
            serviceDescription
            serviceIcon
            serviceBenefits
            ctaText
            ctaLink
          }
          seo {
            ...SeoFields
          }
        }
      }
    }
  `;

  const data = await client.request<{ services: { nodes: WPService[] } }>(
    query
  );
  return data.services.nodes;
}

export async function getServiceBySlug(
  slug: string
): Promise<WPService | null> {
  const query = gql`
    ${SEO_FRAGMENT}
    ${FEATURED_IMAGE_FRAGMENT}
    query GetService($slug: ID!) {
      service(id: $slug, idType: SLUG) {
        id
        title
        slug
        uri
        content
        featuredImage {
          ...FeaturedImageFields
        }
        serviceFields {
          serviceDescription
          serviceIcon
          serviceBenefits
          ctaText
          ctaLink
        }
        seo {
          ...SeoFields
        }
      }
    }
  `;

  const data = await client.request<{ service: WPService }>(query, { slug });
  return data.service ?? null;
}

/* ============================================
   Case Studies (Custom Post Type with ACF)
   ============================================ */

export async function getCaseStudies(): Promise<WPCaseStudy[]> {
  const query = gql`
    ${SEO_FRAGMENT}
    ${FEATURED_IMAGE_FRAGMENT}
    query GetCaseStudies {
      caseStudies(first: 100, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          uri
          content
          featuredImage {
            ...FeaturedImageFields
          }
          caseStudyFields {
            clientName
            clientLogo {
              sourceUrl
              altText
            }
            challenge
            solution
            results
            testimonialQuote
            testimonialAuthor
            testimonialRole
          }
          seo {
            ...SeoFields
          }
        }
      }
    }
  `;

  const data = await client.request<{
    caseStudies: { nodes: WPCaseStudy[] };
  }>(query);
  return data.caseStudies.nodes;
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<WPCaseStudy | null> {
  const query = gql`
    ${SEO_FRAGMENT}
    ${FEATURED_IMAGE_FRAGMENT}
    query GetCaseStudy($slug: ID!) {
      caseStudy(id: $slug, idType: SLUG) {
        id
        title
        slug
        uri
        content
        featuredImage {
          ...FeaturedImageFields
        }
        caseStudyFields {
          clientName
          clientLogo {
            sourceUrl
            altText
          }
          challenge
          solution
          results
          testimonialQuote
          testimonialAuthor
          testimonialRole
        }
        seo {
          ...SeoFields
        }
      }
    }
  `;

  const data = await client.request<{ caseStudy: WPCaseStudy }>(query, {
    slug,
  });
  return data.caseStudy ?? null;
}

/* ============================================
   Team Members (Custom Post Type with ACF)
   ============================================ */

export async function getTeamMembers(): Promise<WPTeamMember[]> {
  const query = gql`
    ${FEATURED_IMAGE_FRAGMENT}
    query GetTeamMembers {
      teamMembers(first: 100, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          uri
          content
          featuredImage {
            ...FeaturedImageFields
          }
          teamMemberFields {
            role
            bio
            linkedin
            email
            headshot {
              sourceUrl
              altText
            }
            order
          }
        }
      }
    }
  `;

  const data = await client.request<{
    teamMembers: { nodes: WPTeamMember[] };
  }>(query);
  return data.teamMembers.nodes;
}

/* ============================================
   Menus
   ============================================ */

export async function getMenu(
  slug: string
): Promise<WPMenuItem[]> {
  const query = gql`
    query GetMenu($slug: ID!) {
      menu(id: $slug, idType: SLUG) {
        name
        menuItems(first: 100) {
          nodes {
            id
            label
            url
            path
            parentId
            childItems {
              nodes {
                id
                label
                url
                path
              }
            }
          }
        }
      }
    }
  `;

  const data = await client.request<MenuResponse>(query, { slug });
  if (!data.menu) return [];

  // Return only top-level items (children are nested)
  return data.menu.menuItems.nodes.filter((item) => !item.parentId);
}

/* ============================================
   Utility: Strip WordPress domain from URLs
   ============================================ */

export function stripWpDomain(url: string): string {
  const wpUrl =
    import.meta.env.PUBLIC_WORDPRESS_URL ||
    "https://admin.wolfpackagency.co";
  return url.replace(wpUrl, "");
}

/* ============================================
   Utility: Format date
   ============================================ */

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
