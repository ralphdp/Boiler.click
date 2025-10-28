import articlesData from "@/data/articles.json";

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  featuredImage: string;
  tags: string[];
  publishedAt: string;
  author: string;
  featured: boolean;
  readTime: string;
  excerpt: string;
  status: "draft" | "review" | "live";
}

export interface ArticlesData {
  articles: Article[];
}

// Get all articles
export function getAllArticles(): Article[] {
  return articlesData.articles as Article[];
}

// Get articles by status
export function getArticlesByStatus(
  status: "draft" | "review" | "live"
): Article[] {
  return (articlesData.articles as Article[]).filter(
    (article) => article.status === status
  );
}

// Get live articles only (for public display)
export function getLiveArticles(): Article[] {
  return getArticlesByStatus("live");
}

// Admin functions for managing articles by status
export function getDraftArticles(): Article[] {
  return getArticlesByStatus("draft");
}

export function getReviewArticles(): Article[] {
  return getArticlesByStatus("review");
}

// Get all articles regardless of status (admin only)
export function getAllArticlesAdmin(): Article[] {
  return articlesData.articles as Article[];
}

// Get article by slug
export function getArticleBySlug(slug: string): Article | undefined {
  return (articlesData.articles as Article[]).find(
    (article) => article.slug === slug
  );
}

// Get featured articles (live only)
export function getFeaturedArticles(): Article[] {
  return getLiveArticles().filter((article) => article.featured);
}

// Get articles by tag (live only)
export function getArticlesByTag(tag: string): Article[] {
  return getLiveArticles().filter((article) =>
    article.tags.some(
      (articleTag) => articleTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

// Get all unique tags (from live articles only)
export function getAllTags(): string[] {
  const allTags = getLiveArticles().flatMap((article) => article.tags);
  return [...new Set(allTags)].sort();
}

// Get recent articles (last 5, live only)
export function getRecentArticles(limit: number = 5): Article[] {
  return getLiveArticles()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

// Search articles (live only)
export function searchArticles(query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  return getLiveArticles().filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.description.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Get related articles (by tags, live only)
export function getRelatedArticles(
  currentArticle: Article,
  limit: number = 3
): Article[] {
  const currentTags = currentArticle.tags;
  return getLiveArticles()
    .filter(
      (article) =>
        article.id !== currentArticle.id &&
        article.tags.some((tag) => currentTags.includes(tag))
    )
    .slice(0, limit);
}

// Generate article URL
export function getArticleUrl(slug: string): string {
  return `/articles/${slug}`;
}

// Generate tag URL
export function getTagUrl(tag: string): string {
  return `/articles?tag=${encodeURIComponent(tag)}`;
}

// Format date for display
export function formatArticleDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate meta description
export function generateMetaDescription(article: Article): string {
  return article.excerpt || article.description;
}

// Generate Open Graph data
export function generateOpenGraphData(article: Article) {
  return {
    title: article.title,
    description: article.excerpt || article.description,
    image: article.featuredImage,
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://boiler.click"
    }/articles/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    author: article.author,
    tags: article.tags,
  };
}

// Generate structured data (JSON-LD)
export function generateStructuredData(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.description,
    image: article.featuredImage,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Boiler.click",
      logo: {
        "@type": "ImageObject",
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://boiler.click"
        }/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://boiler.click"
      }/articles/${article.slug}`,
    },
    keywords: article.tags.join(", "),
    articleSection: "Technology",
    wordCount: article.content.split(" ").length,
  };
}
