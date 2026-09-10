"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import OAuthButtons from "@/components/oauth-buttons";

export default function SignupPage() {
  return (
    <main className="authPage">
      <Link className="logo authLogo" href="/">Trust<span>.</span>Me</Link>
      <section className="authCard">
        <div className="authIcon"><ShieldCheck size={22}/></div>
        <span className="kicker">JOIN TRUST.ME</span>
        <h1>Create your account.</h1>
        <p>Save opportunities, manage enquiries, and build your trusted marketplace profile.</p>

        <OAuthButtons />

        <div className="authDivider"><span>or create with email</span></div>
        <form>
          <label>Full name<input required placeholder="Your name"/></label>
          <label>Email<input required type="email" placeholder="you@example.com"/></label>
          <label>Password<input required type="password" placeholder="Create a password"/></label>
          <button className="primary" type="submit">Create account <ArrowRight size={17}/></button>
        </form>
        <p className="authFine">By continuing, you agree to our marketplace terms and privacy standards.</p>
        <div className="authDivider">Already a member?</div>
        <Link className="secondary" href="/login">Sign in</Link>
      </section>
      <Link className="authBack" href="/">← Back to Trust.Me</Link>
    </main>
  );
}
