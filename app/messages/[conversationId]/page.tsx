import { ConversationThread } from "@/components/messages-client";

type Props = { params: Promise<{ conversationId: string }> };

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  return <ConversationThread conversationId={conversationId} />;
}
