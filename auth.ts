import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import type { OAuthConfig } from "next-auth/providers";

const Instagram = {
  id: "instagram",
  name: "Instagram",
  type: "oauth",
  authorization: {
    url: "https://www.instagram.com/oauth/authorize",
    params: {
      response_type: "code",
      scope: "instagram_business_basic",
    },
  },
  token: "https://api.instagram.com/oauth/access_token",
  userinfo: "https://graph.instagram.com/me?fields=id,username,name",
  clientId: process.env.AUTH_INSTAGRAM_ID,
  clientSecret: process.env.AUTH_INSTAGRAM_SECRET,
  profile(profile: { id: string; username?: string; name?: string }) {
    return {
      id: profile.id,
      name: profile.name ?? profile.username ?? "Instagram user",
      email: null,
      image: null,
    };
  },
} satisfies OAuthConfig<{ id: string; username?: string; name?: string }>;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google, Twitter, Instagram],
  pages: {
    signIn: "/login",
  },
});
