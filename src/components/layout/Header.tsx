"use client";

import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { SquidMascot } from "@/components/mascot/SquidMascot";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold">
          <SquidMascot className="h-8 w-8 text-ink" />
          오진우
        </a>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8 font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative py-1"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-coral transition-transform duration-normal ease-out group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {isMenuOpen ? (
              <path d="M6 6 L18 18 M18 6 L6 18" />
            ) : (
              <path d="M4 7h16 M4 12h16 M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" aria-label="Mobile navigation" className="border-t border-ink/10 md:hidden">
          <ul className="flex flex-col px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-3 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
