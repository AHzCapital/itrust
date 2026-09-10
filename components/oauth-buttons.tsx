"use client";

import { signIn } from "next-auth/react";
import { Instagram, Twitter } from "lucide-react";

type Provider = "google" | "twitter" | "instagram";
const providers: Array<{ id: Provider; label: string }> = [
  { id: "google", label: "Continue with Google" },
  { id: "twitter", label: "Continue with X" },
  { id: "instagram", label: "Continue with Instagram" },
];

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.7 2.91-4.2 2.91-7.21Z"/><path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.75Z"/><path fill="#FBBC05" d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.65H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.35l3.24-2.52Z"/><path fill="#EA4335" d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.23 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.4l3.24 2.52C7.31 7.86 9.46 6.14 12 6.14Z"/></svg>;
}

export default function OAuthButtons() {
  return <div className="oauthStack">{providers.map((provider) => <button className="oauthButton" key={provider.id} type="button" onClick={() => signIn(provider.id, { callbackUrl: "/profile" })}><span className="oauthIcon">{provider.id === "google" && <GoogleMark/>}{provider.id === "twitter" && <Twitter size={18} strokeWidth={2.1}/>} {provider.id === "instagram" && <Instagram size={18} strokeWidth={2.1}/>}</span>{provider.label}</button>)}</div>;
}
