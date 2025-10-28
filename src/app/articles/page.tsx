"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Head from "next/head";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import {
  getLiveArticles,
  getAllTags,
  formatArticleDate,
  getArticleUrl,
} from "@/lib/articles";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";

export default function ArticlesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allArticles = getLiveArticles();
  const allTags = getAllTags();

  const filteredArticles = useMemo(() => {
    let filtered = allArticles;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      console.log("Searching for:", query);
      console.log(
        "Available articles:",
        allArticles.map((a) => a.title)
      );

      filtered = filtered.filter((article) => {
        const matches =
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query));

        console.log(`Article "${article.title}" matches:`, matches);
        return matches;
      });

      console.log(
        "Filtered results:",
        filtered.map((a) => a.title)
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((article) =>
        article.tags.includes(selectedTag)
      );
    }

    return filtered;
  }, [allArticles, searchQuery, selectedTag]);

  const featuredArticle = allArticles.find((article) => article.featured);
  const otherArticles = filteredArticles.filter((article) => !article.featured);

  // When filtering by tag or search, include featured article in the list if it matches the filter
  const shouldShowFeaturedInList = selectedTag || searchQuery;
  const articlesToShow = shouldShowFeaturedInList
    ? filteredArticles
    : otherArticles;

  return (
    <>
      <Head>
        <title>Articles & Updates - Boiler.click</title>
        <meta
          name="description"
          content="Stay updated with the latest developments, tutorials, and insights from the Boiler.click team. Learn about our development process, mission, and upcoming features."
        />
        <meta
          name="keywords"
          content="articles, updates, development, boilerplate, SaaS, Next.js, React, TypeScript, tutorials, insights"
        />
        <meta property="og:title" content="Articles & Updates - Boiler.click" />
        <meta
          property="og:description"
          content="Stay updated with the latest developments, tutorials, and insights from the Boiler.click team."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://boiler.click/articles" />
        <meta property="og:image" content="https://boiler.click/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Articles & Updates - Boiler.click"
        />
        <meta
          name="twitter:description"
          content="Stay updated with the latest developments, tutorials, and insights from the Boiler.click team."
        />
        <meta
          name="twitter:image"
          content="https://boiler.click/og-image.svg"
        />
        <link rel="canonical" href="https://boiler.click/articles" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Articles & Updates - Boiler.click",
              description:
                "Stay updated with the latest developments, tutorials, and insights from the Boiler.click team.",
              url: "https://boiler.click/articles",
              mainEntity: {
                "@type": "ItemList",
                itemListElement: allArticles.map((article, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Article",
                    headline: article.title,
                    description: article.excerpt,
                    url: `https://boiler.click/articles/${article.slug}`,
                    datePublished: article.publishedAt,
                    author: {
                      "@type": "Person",
                      name: article.author,
                    },
                  },
                })),
              },
            }),
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
          aria-label="Articles page main content"
        >
          <div className="prose prose-lg dark:prose-invert w-full">
            <motion.div
              className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
                {t("articles.title")}
              </h1>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <p className="text-lg text-zinc-600 dark:text-zinc-200 leading-relaxed">
                {t("articles.description")}
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t("articles.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag(null);
                  }}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  {t("articles.clearFilters")}
                </Button>
              </div>

              {/* Tags Filter */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedTag === null
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-purple-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t("articles.all")}
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selectedTag === tag
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Featured Article */}
              {featuredArticle && !selectedTag && !searchQuery && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Featured Article Image */}
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <div className="relative w-full h-48 sm:w-32 sm:h-24 rounded-lg overflow-hidden">
                          <Image
                            src={featuredArticle.featuredImage}
                            alt={featuredArticle.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Featured Article Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-medium rounded-full">
                            {t("articles.featured")}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {featuredArticle.readTime}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {featuredArticle.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatArticleDate(featuredArticle.publishedAt)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featuredArticle.tags.map((tag) => (
                            <Badge
                              variant="outline"
                              role="listitem"
                              key={tag}
                              className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-2 py-1 text-xs font-small"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Link href={getArticleUrl(featuredArticle.slug)}>
                          <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer">
                            {t("articles.readMore")}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Articles List */}
              <div className="w-full space-y-4">
                {articlesToShow.map((article) => (
                  <div
                    key={article.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <Link href={getArticleUrl(article.slug)}>
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Article Image */}
                          <div className="flex-shrink-0 w-full sm:w-auto">
                            <div className="relative w-full h-48 sm:w-32 sm:h-24 rounded-lg overflow-hidden">
                              <Image
                                src={article.featuredImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>

                          {/* Article Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {article.readTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {article.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatArticleDate(article.publishedAt)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                  +{article.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* No Results */}
              {articlesToShow.length === 0 && (
                <div className="flex flex-col w-full items-center justify-center py-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("articles.noResults")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t("articles.tryAdjusting")}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTag(null);
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    {t("articles.clearFilters")}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
