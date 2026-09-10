import { redirect } from "next/navigation";
import { NewConversation } from "@/components/messages-client";

type Props = { searchParams: Promise<{ to?: string }> };

export default async function NewMessagePage({ searchParams }: Props) {
  const { to } = await searchParams;
  if (!to) redirect("/messages");
  return <NewConversation username={to} />;
}
