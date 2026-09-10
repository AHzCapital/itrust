import NetworkListClient from "@/components/network-list-client";
export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) { return <NetworkListClient username={(await params).username} mode="following" />; }
