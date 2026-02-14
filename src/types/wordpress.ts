/* ============================================
   WordPress GraphQL Type Definitions
   ============================================ */

// --- Media ---

export interface WPMediaItem {
  sourceUrl: string;
  altText: string;
  mediaDetails: {
    width: number;
    height: number;
  } | null;
}

// --- SEO (Yoast via WPGraphQL Yoast SEO Addon) ---

export interface WPSeo {
  title: string;
  metaDesc: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: WPMediaItem | null;
  canonical: string;
}

// --- Categories & Tags ---

export interface WPCategory {
  name: string;
  slug: string;
  uri: string;
}

export interface WPTag {
  name: string;
  slug: string;
}

// --- Posts ---

export interface WPPost {
  id: string;
  title: string;
  slug: string;
  uri: string;
  date: string;
  modified: string;
  excerpt: string;
  content: string;
  featuredImage: {
    node: WPMediaItem;
  } | null;
  categories: {
    nodes: WPCategory[];
  };
  tags: {
    nodes: WPTag[];
  };
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      } | null;
    };
  };
  seo?: WPSeo;
}

// --- Pages ---

export interface WPPage {
  id: string;
  title: string;
  slug: string;
  uri: string;
  content: string;
  date: string;
  modified: string;
  featuredImage: {
    node: WPMediaItem;
  } | null;
  seo?: WPSeo;
}

// --- ACF Custom Fields: Services ---

export interface ACFServiceFields {
  serviceDescription: string;
  serviceIcon: string;
  serviceBenefits: { benefit: string }[] | null;
  ctaText: string;
  ctaLink: string;
}

export interface WPService extends WPPage {
  serviceFields: ACFServiceFields;
}

// --- ACF Custom Fields: Case Studies ---

export interface ACFCaseStudyFields {
  clientName: string;
  clientLogo: WPMediaItem | null;
  challenge: string;
  solution: string;
  results: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
}

export interface WPCaseStudy extends WPPage {
  caseStudyFields: ACFCaseStudyFields;
}

// --- ACF Custom Fields: Team Members ---

export interface ACFTeamMemberFields {
  role: string;
  bio: string;
  linkedin: string;
  email: string;
  headshot: WPMediaItem | null;
  order: number;
}

export interface WPTeamMember extends WPPage {
  teamMemberFields: ACFTeamMemberFields;
}

// --- Menus ---

export interface WPMenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId: string | null;
  childItems: {
    nodes: WPMenuItem[];
  };
}

export interface WPMenu {
  name: string;
  menuItems: {
    nodes: WPMenuItem[];
  };
}

// --- GraphQL Response Wrappers ---

export interface PostsResponse {
  posts: {
    nodes: WPPost[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

export interface PostResponse {
  post: WPPost;
}

export interface PagesResponse {
  pages: {
    nodes: WPPage[];
  };
}

export interface PageResponse {
  page: WPPage;
}

export interface MenuResponse {
  menu: WPMenu;
}
