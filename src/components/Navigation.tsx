"use client";

import { motion } from "framer-motion";
import { Flame, Menu, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { t, isRTL } = useLanguage();
  const { user, logout, isLoading } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus management for mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuRef.current) {
        // Close mobile menu on escape
        const closeButton = document.querySelector(
          "[data-sheet-trigger]"
        ) as HTMLButtonElement;
        closeButton?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus first link when mobile menu opens
  const handleMobileMenuOpen = () => {
    setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 100);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Boiler.click homepage"
            >
              <Flame
                className="w-6 h-6 text-purple-500 dark:text-purple-400"
                aria-hidden="true"
              />
              <span className="text-xl font-bold font-cabin">
                {(() => {
                  const title = t("navigation.title") as string;
                  const parts = title.split(".");
                  return (
                    <>
                      {parts[0]}
                      <span className="text-xs">.{parts[1] || ""}</span>
                    </>
                  );
                })()}
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <motion.div
              className={`hidden md:flex items-center gap-6 ${
                isRTL ? "rtl:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {t("navigation.about")}
              </Link>
              <Link
                href="/mission"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {t("navigation.mission")}
              </Link>

              <Link
                href="/articles"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {t("navigation.articles")}
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {t("navigation.faq")}
              </Link>
              <Link
                href="/documentation"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {t("navigation.documentation")}
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {t("navigation.support")}
              </Link>
            </motion.div>

            {/* Desktop Controls */}
            <div
              className="hidden md:flex items-center gap-4"
              role="group"
              aria-label="Navigation controls"
            >
              <SimpleLanguageSwitcher />

              {/* Auth Controls */}
              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          <span className="hidden lg:inline">
                            {user.firstName}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            {t("navigation.account")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account/profile"
                            className="flex items-center gap-2"
                          >
                            {t("navigation.profile")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account/settings"
                            className="flex items-center gap-2"
                          >
                            {t("navigation.settings")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={logout}
                          className="flex items-center gap-2 text-red-600 dark:text-red-400"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("navigation.logout")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/auth/login">{t("navigation.signIn")}</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/auth/register">
                          {t("navigation.signUp")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Toggle mobile menu"
                  aria-expanded="false"
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? "left" : "right"}
                className="w-[300px] sm:w-[400px]"
                onOpenAutoFocus={handleMobileMenuOpen}
              >
                <SheetHeader>
                  <SheetTitle className={isRTL ? "text-right" : "text-left"}>
                    Navigation
                  </SheetTitle>
                </SheetHeader>
                <div
                  ref={mobileMenuRef}
                  id="mobile-menu"
                  className="flex flex-col space-y-4 mt-6"
                  role="navigation"
                  aria-label="Mobile navigation menu"
                >
                  {/* ARIA Live Region for dynamic content */}
                  <div
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                  >
                    Mobile navigation menu opened
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-4" role="menubar">
                    <Link
                      ref={firstLinkRef}
                      href="/about"
                      className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {t("navigation.about")}
                    </Link>
                    <Link
                      href="/mission"
                      className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {t("navigation.mission")}
                    </Link>
                    <Link
                      href="/support"
                      className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {t("navigation.support")}
                    </Link>
                    <Link
                      href="/articles"
                      className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {t("navigation.articles")}
                    </Link>
                    <Link
                      href="/faq"
                      className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {t("navigation.faq")}
                    </Link>
                  </div>

                  {/* Mobile Controls */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <SimpleLanguageSwitcher />

                    {/* Mobile Auth Controls */}
                    {!isLoading && (
                      <>
                        {user ? (
                          <div className="space-y-2">
                            <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              Signed in as {user.firstName} {user.lastName}
                            </div>
                            <Link
                              href="/account"
                              className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                              role="menuitem"
                              tabIndex={0}
                            >
                              Account
                            </Link>
                            <Link
                              href="/account/profile"
                              className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                              role="menuitem"
                              tabIndex={0}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/account/settings"
                              className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                              role="menuitem"
                              tabIndex={0}
                            >
                              Settings
                            </Link>
                            <button
                              onClick={logout}
                              className="block w-full text-left text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                              role="menuitem"
                              tabIndex={0}
                            >
                              Sign Out
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <Link
                              href="/auth/login"
                              className="block text-center text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              role="menuitem"
                              tabIndex={0}
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/auth/register"
                              className="block text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              role="menuitem"
                              tabIndex={0}
                            >
                              Sign Up
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
