import type { Metadata } from "next";
import PublicPostClient from "@/components/public-post-client";

export async function generateMetadata({ params }: { params: Promise<{ username: string; postId: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s post — Trust.Me`,
    description: `A post by ${username} on Trust.Me — Verified. Valuable. Yours.`,
    openGraph: {
      title: `${username}'s post — Trust.Me`,
      description: `A post by ${username} on Trust.Me — Verified. Valuable. Yours.`,
      type: "article",
    },
  };
}

export default async function PublicPostPage({ params }: { params: Promise<{ username: string; postId: string }> }) {
  const { username, postId } = await params;
  return <PublicPostClient username={decodeURIComponent(username)} postId={decodeURIComponent(postId)} />;
}
