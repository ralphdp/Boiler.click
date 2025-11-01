"use client";

import { use } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Head from "next/head";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
import {
  getArticleBySlug,
  getRelatedArticles,
  formatArticleDate,
  getArticleUrl,
  generateStructuredData,
} from "@/lib/articles";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { t } = useLanguage();
  const resolvedParams = use(params);
  const article = getArticleBySlug(resolvedParams.slug);
  const [showShare, setShowShare] = useState(false);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  return (
    <>
      <Head>
        <title>{article.title} - Boiler™</title>
        <meta
          name="description"
          content={article.excerpt || article.description}
        />
        <meta name="keywords" content={article.tags.join(", ")} />
        <meta property="og:title" content={article.title} />
        <meta
          property="og:description"
          content={article.excerpt || article.description}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://boiler.click/articles/${article.slug}`}
        />
        <meta property="og:image" content={article.featuredImage} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content="Technology" />
        <meta property="article:tag" content={article.tags.join(", ")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta
          name="twitter:description"
          content={article.excerpt || article.description}
        />
        <meta name="twitter:image" content={article.featuredImage} />
        <link
          rel="canonical"
          href={`https://boiler.click/articles/${article.slug}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(article)),
          }}
        />
      </Head>
      <div className="min-h-screen font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
        {/* Animated Gradient Background */}
        <HeroBackground />

        {/* Dark Overlay */}
        <DarkOverlay />

        <Navigation />
        <main
          className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10"
          role="main"
          aria-label="Article page main content"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link href="/articles">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Articles
                </Button>
              </Link>
            </motion.div>

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                {article.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                <span className="text-sm text-zinc-500">
                  {article.readTime}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                {article.title}
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-200 mb-6">
                {article.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatArticleDate(article.publishedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                {showShare && (
                  <span className="text-sm text-green-600">
                    Link copied to clipboard!
                  </span>
                )}
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="article-content prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: article.content
                    .split("\n")
                    .map((line) => {
                      // Handle headers
                      if (line.startsWith("### ")) {
                        return `<h3 class="text-xl font-semibold mb-3">${line.slice(
                          4
                        )}</h3>`;
                      } else if (line.startsWith("## ")) {
                        return `<h2 class="text-2xl font-bold mb-4">${line.slice(
                          3
                        )}</h2>`;
                      } else if (line.startsWith("# ")) {
                        return `<h1 class="text-3xl font-bold mb-6">${line.slice(
                          2
                        )}</h1>`;
                      }
                      // Handle horizontal rule
                      else if (line.trim() === "---") {
                        return '<hr class="my-8 border-zinc-300 dark:border-zinc-700">';
                      }
                      // Handle list items
                      else if (line.startsWith("- ")) {
                        return `<li class="ml-4 mb-2">${line.slice(2)}</li>`;
                      }
                      // Handle numbered lists
                      else if (/^\d+\. /.test(line)) {
                        return `<li class="ml-4 mb-2">${line.replace(
                          /^\d+\. /,
                          ""
                        )}</li>`;
                      }
                      // Handle empty lines
                      else if (line.trim() === "") {
                        return "<br>";
                      }
                      // Handle regular paragraphs
                      else {
                        return `<p class="mb-4">${line}</p>`;
                      }
                    })
                    .join("")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(
                      /\[([^\]]+)\]\(([^)]+)\)/g,
                      '<a href="$2" class="text-purple-600 hover:text-purple-700 underline">$1</a>'
                    ),
                }}
              />
            </motion.div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800"
              >
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={getArticleUrl(relatedArticle.slug)}
                    >
                      <div className="group cursor-pointer">
                        <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={relatedArticle.featuredImage}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{relatedArticle.readTime}</span>
                          <span>•</span>
                          <span>
                            {formatArticleDate(relatedArticle.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
