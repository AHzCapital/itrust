import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import type { OAuthConfig } from "next-auth/providers";
import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/social";

const Instagram = {
  id: "instagram",
  name: "Instagram",
  type: "oauth",
  authorization: {
    url: "https://www.instagram.com/oauth/authorize",
    params: { response_type: "code", scope: "instagram_business_basic" },
  },
  token: "https://api.instagram.com/oauth/access_token",
  userinfo: "https://graph.instagram.com/me?fields=id,username,name",
  clientId: process.env.AUTH_INSTAGRAM_ID,
  clientSecret: process.env.AUTH_INSTAGRAM_SECRET,
  profile(profile: { id: string; username?: string; name?: string }) {
    return { id: profile.id, name: profile.name ?? profile.username ?? "Instagram user", email: null, image: null };
  },
} satisfies OAuthConfig<{ id: string; username?: string; name?: string }>;

async function ensureUser(user: { id?: string; email?: string | null; name?: string | null; image?: string | null }) {
  const email = user.email?.trim().toLowerCase() || null;
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return existing;
  }
  const base = normalizeUsername(user.name || "member") || "member";
  let username = base;
  let suffix = 2;
  while (await prisma.user.findUnique({ where: { usernameKey: username } })) {
    username = `${base.slice(0, Math.max(1, 20 - String(suffix).length - 1))}_${suffix}`;
    suffix += 1;
  }
  return prisma.user.create({ data: { email, name: user.name || "Member", image: user.image || null, username, usernameKey: username } });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google, Twitter, Instagram],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const appUser = await ensureUser(user);
        token.sub = appUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
