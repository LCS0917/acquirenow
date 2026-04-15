"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  data?: {
    nav1Label: string;
    nav1Url: string;
    nav2Label: string;
    nav2Url: string;
    nav3Label: string;
    nav3Url: string;
    nav4Label: string;
    nav4Url: string;
    emailLabel: string;
    emailUrl: string;
  };
}

export default function Header({ data }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = data ? [
    { name: data.nav1Label, href: data.nav1Url },
    { name: data.nav2Label, href: data.nav2Url },
    { name: data.nav3Label, href: data.nav3Url },
    { name: data.nav4Label, href: data.nav4Url },
  ] : [
    { name: "Work", href: "/work" },
    { name: "VBC Index", href: "/vbcindex" },
    { name: "Insights", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const emailLabel = data?.emailLabel || "Email";
  const emailUrl = data?.emailUrl || "mailto:lena@acquirenowhq.com";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-neutral">
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group" onClick={() => setIsOpen(false)}>
          <div className="relative h-8 w-40 transition-transform group-hover:scale-105">
            <Image 
              src="/assets/logo-black.png"
              alt="AcquireNow" 
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navigation.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className="text-[11px] font-bold uppercase tracking-[0.3em] hover:text-brand-plum transition-colors relative group/link text-brand-dark/90"
            >
              {item.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover/link:w-full" />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-brand-dark hover:text-brand-plum transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 top-20 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col p-8 space-y-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-2xl font-display font-bold text-brand-dark hover:text-brand-plum transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-8 border-t border-brand-neutral">
             <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-plum/70 mb-4">Contact</p>
             <a href={emailUrl} className="text-lg text-brand-plum hover:text-brand-dark transition-colors italic">{emailUrl.replace('mailto:', '')}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
