"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="themeSwitcher" aria-label="Appearance">
      <button className={theme === "light" ? "selected" : ""} onClick={() => setTheme("light")} aria-label="Light theme"><Sun size={15}/><span>Light</span></button>
      <button className={theme === "dark" ? "selected" : ""} onClick={() => setTheme("dark")} aria-label="Dark theme"><Moon size={15}/><span>Dark</span></button>
      <button className={theme === "system" ? "selected" : ""} onClick={() => setTheme("system")} aria-label="System theme"><Monitor size={15}/><span>System</span></button>
    </div>
  );
}
