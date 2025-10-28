"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
export default function LegalPage() {
  const { t } = useLanguage();

  // Get dynamic contact information from environment variables
  const supportEmail =
    process.env.NEXT_PUBLIC_SITE_EMAIL_SUPPORT || "legal@boiler.click";
  const physicalAddress =
    process.env.NEXT_PUBLIC_SITE_PHYSICAL_ADDRESS || "123 Oak St.";

  return (
    <div className="min-h-screen font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black relative">
      {/* Animated Gradient Background */}
      <HeroBackground />

      {/* Dark Overlay */}
      <DarkOverlay />

      <Navigation />
      <main
        className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10"
        role="main"
        aria-label="Legal page main content"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
              {t("legal.title")}
            </h1>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("legal.lastUpdated")}
            </div>

            <div
              className="space-y-12"
              role="contentinfo"
              aria-label="Legal policies"
            >
              {/* Privacy Policy */}
              <section aria-labelledby="privacy-policy">
                <h2
                  id="privacy-policy"
                  className="text-3xl font-bold text-black dark:text-white mb-6"
                >
                  {t("legal.privacyPolicy.title")}
                </h2>

                <div className="space-y-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("legal.privacyPolicy.introduction")}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.privacyPolicy.informationCollection.title")}
                    </h3>
                    <ul className="space-y-3">
                      <li className="text-gray-600 dark:text-gray-400">
                        <strong className="text-black dark:text-white">
                          {t(
                            "legal.privacyPolicy.informationCollection.personalInfoLabel"
                          )}
                          :
                        </strong>{" "}
                        {t(
                          "legal.privacyPolicy.informationCollection.personalInfo"
                        )}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        <strong className="text-black dark:text-white">
                          {t(
                            "legal.privacyPolicy.informationCollection.usageDataLabel"
                          )}
                          :
                        </strong>{" "}
                        {t(
                          "legal.privacyPolicy.informationCollection.usageData"
                        )}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        <strong className="text-black dark:text-white">
                          {t(
                            "legal.privacyPolicy.informationCollection.cookiesLabel"
                          )}
                          :
                        </strong>{" "}
                        {t("legal.privacyPolicy.informationCollection.cookies")}
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.privacyPolicy.informationUse.title")}
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.privacyPolicy.informationUse.service")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        {t("legal.privacyPolicy.informationUse.communication")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.privacyPolicy.informationUse.analytics")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.privacyPolicy.informationUse.security")}
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.privacyPolicy.informationSharing.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.privacyPolicy.informationSharing.content")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.privacyPolicy.dataSecurity.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.privacyPolicy.dataSecurity.content")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.privacyPolicy.yourRights.title")}
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.privacyPolicy.yourRights.access")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.privacyPolicy.yourRights.correction")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.privacyPolicy.yourRights.deletion")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.privacyPolicy.yourRights.portability")}
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Terms of Service */}
              <section aria-labelledby="terms-of-service">
                <h2
                  id="terms-of-service"
                  className="text-3xl font-bold text-black dark:text-white mb-6"
                >
                  {t("legal.termsOfService.title")}
                </h2>

                <div className="space-y-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("legal.termsOfService.introduction")}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.termsOfService.acceptance.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.termsOfService.acceptance.content")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.termsOfService.useLicense.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                      {t("legal.termsOfService.useLicense.permission")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.termsOfService.useLicense.restrictions")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.termsOfService.userAccounts.title")}
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        {t("legal.termsOfService.userAccounts.responsibility")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.termsOfService.userAccounts.security")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.termsOfService.userAccounts.termination")}
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.termsOfService.prohibitedUses.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.termsOfService.prohibitedUses.content")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.termsOfService.disclaimer.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.termsOfService.disclaimer.content")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.termsOfService.limitation.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.termsOfService.limitation.content")}
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookie Policy */}
              <section aria-labelledby="cookie-policy">
                <h2
                  id="cookie-policy"
                  className="text-3xl font-bold text-black dark:text-white mb-6"
                >
                  {t("legal.cookiePolicy.title")}
                </h2>

                <div className="space-y-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("legal.cookiePolicy.introduction")}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.cookiePolicy.whatAreCookies.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("legal.cookiePolicy.whatAreCookies.content")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.cookiePolicy.howWeUseCookies.title")}
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t(
                            "legal.cookiePolicy.howWeUseCookies.essentialLabel"
                          )}
                          :
                        </strong>{" "}
                        {t("legal.cookiePolicy.howWeUseCookies.essential")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t(
                            "legal.cookiePolicy.howWeUseCookies.analyticsLabel"
                          )}
                          :
                        </strong>{" "}
                        {t("legal.cookiePolicy.howWeUseCookies.analytics")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t(
                            "legal.cookiePolicy.howWeUseCookies.preferencesLabel"
                          )}
                          :
                        </strong>{" "}
                        {t("legal.cookiePolicy.howWeUseCookies.preferences")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t(
                            "legal.cookiePolicy.howWeUseCookies.marketingLabel"
                          )}
                          :
                        </strong>{" "}
                        {t("legal.cookiePolicy.howWeUseCookies.marketing")}
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.cookiePolicy.cookieTypes.title")}
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t("legal.cookiePolicy.cookieTypes.sessionLabel")}:
                        </strong>{" "}
                        {t("legal.cookiePolicy.cookieTypes.session")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t("legal.cookiePolicy.cookieTypes.persistentLabel")}:
                        </strong>{" "}
                        {t("legal.cookiePolicy.cookieTypes.persistent")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t("legal.cookiePolicy.cookieTypes.firstPartyLabel")}:
                        </strong>{" "}
                        {t("legal.cookiePolicy.cookieTypes.firstParty")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        <strong className="text-black dark:text-white">
                          {t("legal.cookiePolicy.cookieTypes.thirdPartyLabel")}:
                        </strong>{" "}
                        {t("legal.cookiePolicy.cookieTypes.thirdParty")}
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {t("legal.cookiePolicy.managingCookies.title")}
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 dark:text-gray-400">
                        •{" "}
                        {t(
                          "legal.cookiePolicy.managingCookies.browserSettings"
                        )}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.cookiePolicy.managingCookies.optOut")}
                      </li>
                      <li className="text-gray-600 dark:text-gray-400">
                        • {t("legal.cookiePolicy.managingCookies.impact")}
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section aria-labelledby="contact">
                <h2
                  id="contact"
                  className="text-3xl font-bold text-black dark:text-white mb-6"
                >
                  {t("legal.contact.title")}
                </h2>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("legal.contact.content")}
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("legal.contact.emailLabel")}: {supportEmail}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("legal.contact.addressLabel")}: {physicalAddress}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
