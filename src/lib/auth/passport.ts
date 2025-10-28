import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { PrismaClient } from "@prisma/client";
import { VerifyCallback } from "passport-oauth2";
import {
  comparePassword,
  hashPassword,
  savePasswordToHistory,
} from "./password";
import { config } from "@/lib/config";

const prisma = new PrismaClient();

// Local Strategy for email/password login
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        if (!user.password) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        if (!user.emailVerified) {
          return done(null, false, {
            message: "Please verify your email before logging in",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.auth.google.clientId,
      clientSecret: config.auth.google.clientSecret,
      callbackURL: "/api/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found for Google profile."));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          // User exists, check if Google account is linked
          const account = await prisma.account.findUnique({
            where: {
              provider_providerId: {
                provider: "google",
                providerId: profile.id,
              },
            },
          });

          if (!account) {
            // Link Google account to existing user
            await prisma.account.create({
              data: {
                userId: user.id,
                provider: "google",
                providerId: profile.id,
                accessToken,
                refreshToken,
              },
            });
          }
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.name?.givenName || "User",
              lastName: profile.name?.familyName || "",
              password: await hashPassword(crypto.randomUUID()), // Set a random password for OAuth users
              emailVerified: true, // OAuth providers verify email
              role: isSuperAdminEmail(email) ? "super_admin" : "user",
              accounts: {
                create: {
                  provider: "google",
                  providerId: profile.id,
                  accessToken,
                  refreshToken,
                },
              },
            },
          });
          // No need to save password history for random password
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: config.auth.github.clientId,
      clientSecret: config.auth.github.clientSecret,
      callbackURL: "/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found for GitHub profile."));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          const account = await prisma.account.findUnique({
            where: {
              provider_providerId: {
                provider: "github",
                providerId: profile.id,
              },
            },
          });

          if (!account) {
            await prisma.account.create({
              data: {
                userId: user.id,
                provider: "github",
                providerId: profile.id,
                accessToken,
                refreshToken,
              },
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.displayName?.split(" ")[0] || "User",
              lastName:
                profile.displayName?.split(" ").slice(1).join(" ") || "",
              password: await hashPassword(crypto.randomUUID()),
              emailVerified: true,
              role: isSuperAdminEmail(email) ? "super_admin" : "user",
              accounts: {
                create: {
                  provider: "github",
                  providerId: profile.id,
                  accessToken,
                  refreshToken,
                },
              },
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Discord OAuth Strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: config.auth.discord.clientId,
      clientSecret: config.auth.discord.clientSecret,
      callbackURL: "/api/auth/discord/callback",
      scope: ["identify", "email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.email;
        if (!email) {
          return done(new Error("No email found for Discord profile."));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          const account = await prisma.account.findUnique({
            where: {
              provider_providerId: {
                provider: "discord",
                providerId: profile.id,
              },
            },
          });

          if (!account) {
            await prisma.account.create({
              data: {
                userId: user.id,
                provider: "discord",
                providerId: profile.id,
                accessToken,
                refreshToken,
              },
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.username || "User",
              lastName: "",
              password: await hashPassword(crypto.randomUUID()),
              emailVerified: true,
              role: isSuperAdminEmail(email) ? "super_admin" : "user",
              accounts: {
                create: {
                  provider: "discord",
                  providerId: profile.id,
                  accessToken,
                  refreshToken,
                },
              },
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.auth.facebook.clientId,
      clientSecret: config.auth.facebook.clientSecret,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found for Facebook profile."));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          const account = await prisma.account.findUnique({
            where: {
              provider_providerId: {
                provider: "facebook",
                providerId: profile.id,
              },
            },
          });

          if (!account) {
            await prisma.account.create({
              data: {
                userId: user.id,
                provider: "facebook",
                providerId: profile.id,
                accessToken,
                refreshToken,
              },
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.displayName?.split(" ")[0] || "User",
              lastName:
                profile.displayName?.split(" ").slice(1).join(" ") || "",
              password: await hashPassword(crypto.randomUUID()),
              emailVerified: true,
              role: isSuperAdminEmail(email) ? "super_admin" : "user",
              accounts: {
                create: {
                  provider: "facebook",
                  providerId: profile.id,
                  accessToken,
                  refreshToken,
                },
              },
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Twitter OAuth Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.auth.twitter.clientId,
      consumerSecret: config.auth.twitter.clientSecret,
      callbackURL: "/api/auth/twitter/callback",
      includeEmail: true,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found for Twitter profile."));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          const account = await prisma.account.findUnique({
            where: {
              provider_providerId: {
                provider: "twitter",
                providerId: profile.id,
              },
            },
          });

          if (!account) {
            await prisma.account.create({
              data: {
                userId: user.id,
                provider: "twitter",
                providerId: profile.id,
                accessToken: token,
                refreshToken: tokenSecret, // Twitter uses tokenSecret as refresh token
              },
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.displayName?.split(" ")[0] || "User",
              lastName:
                profile.displayName?.split(" ").slice(1).join(" ") || "",
              password: await hashPassword(crypto.randomUUID()),
              emailVerified: true,
              role: isSuperAdminEmail(email) ? "super_admin" : "user",
              accounts: {
                create: {
                  provider: "twitter",
                  providerId: profile.id,
                  accessToken: token,
                  refreshToken: tokenSecret,
                },
              },
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        telephone: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

/**
 * Checks if an email belongs to a super admin.
 * @param email The email to check.
 * @returns True if the email is a super admin email, false otherwise.
 */
function isSuperAdminEmail(email: string): boolean {
  const superAdminEmails = config.auth.superAdminEmails || [];
  return superAdminEmails.includes(email.toLowerCase());
}

export default passport;
