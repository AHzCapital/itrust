import type { Metadata } from "next";
import PublicProfileClient from "@/components/public-profile-client";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} — Trust.Me`,
    description: `${username} on Trust.Me — Verified. Valuable. Yours.`,
    openGraph: {
      title: `${username} — Trust.Me`,
      description: `${username} on Trust.Me — Verified. Valuable. Yours.`,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <PublicProfileClient username={decodeURIComponent(username)} />;
}
