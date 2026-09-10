"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage(){return <main className="authPage"><Link className="logo authLogo" href="/">Trust<span>.</span>Me</Link><section className="authCard"><div className="authIcon"><ShieldCheck size={22}/></div><span className="kicker">WELCOME BACK</span><h1>Sign in to Trust.Me.</h1><p>Access saved assets, enquiries, and your marketplace activity.</p><form><label>Email<input type="email" required placeholder="you@example.com"/></label><label>Password<input type="password" required placeholder="••••••••"/></label><button className="primary" type="submit">Sign in <ArrowRight size={17}/></button></form><div className="authDivider">or</div><Link className="secondary" href="/signup">Create an account</Link></section><Link className="authBack" href="/">← Back to Trust.Me</Link></main>}
