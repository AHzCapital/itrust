import { NewConversation } from "@/components/messages-client";

type Props = { searchParams: Promise<{ to?: string }> };

export default async function NewMessagePage({ searchParams }: Props) {
  const { to } = await searchParams;
  return to ? <NewConversation username={to} /> : <NewConversation username="" />;
}
