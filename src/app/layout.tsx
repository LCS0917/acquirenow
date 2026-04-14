import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

// Using Montserrat as a clean, geometric alternative to Avenir
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-avenir",
});

export const metadata: Metadata = {
  title: "AcquireNow | Lena Shaw",
  description: "Healthcare Operations & Product Strategy",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", openSans.variable, montserrat.variable)}>
      <body className="min-h-full flex flex-col font-sans text-brand-dark bg-white">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-neutral">
          <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative h-12 w-12 transition-transform group-hover:scale-110">
                <Image 
                  src="/assets/a-logo.png" 
                  alt="AcquireNow" 
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-12">
              <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.3em] hover:text-brand-plum transition-colors relative group/link text-brand-dark/70">
                Work
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover/link:w-full" />
              </Link>
              <Link href="/vbcindex" className="text-[11px] font-bold uppercase tracking-[0.3em] hover:text-brand-plum transition-colors relative group/link text-brand-dark/70">
                VBC Index
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover/link:w-full" />
              </Link>
              <Link href="/insights" className="text-[11px] font-bold uppercase tracking-[0.3em] hover:text-brand-plum transition-colors relative group/link text-brand-dark/70">
                Insights
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover/link:w-full" />
              </Link>
              <Link href="/about" className="text-[11px] font-bold uppercase tracking-[0.3em] hover:text-brand-plum transition-colors relative group/link text-brand-dark/70">
                About
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover/link:w-full" />
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-[#1a191b] text-white py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-plum opacity-5 skew-x-[-12deg] translate-x-20" />
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-24">
              <div>
                <Link href="/" className="flex items-center gap-4 mb-10 group">
                  <div className="relative h-8 w-40">
                    <Image 
                      src="/assets/logo-white.png" 
                      alt="AcquireNow" 
                      fill
                      className="object-contain object-left opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </Link>
                <p className="text-brand-neutral/40 text-lg max-w-sm leading-relaxed italic border-l-2 border-brand-gold/50 pl-8">
                  Strategic operations and product leadership for the next generation of healthcare delivery.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-10 text-brand-gold">Navigation</h4>
                  <ul className="space-y-6 text-[10px] font-bold uppercase tracking-[0.4em]">
                    <li><Link href="/work" className="hover:text-brand-gold transition-colors">Work</Link></li>
                    <li><Link href="/vbcindex" className="hover:text-brand-gold transition-colors">VBC Index</Link></li>
                    <li><Link href="/insights" className="hover:text-brand-gold transition-colors">Insights</Link></li>
                    <li><Link href="/about" className="hover:text-brand-gold transition-colors">About</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-10 text-brand-gold">Contact</h4>
                  <ul className="space-y-6 text-[10px] font-bold uppercase tracking-[0.4em]">
                    <li><a href="mailto:lena@acquirenow.com" className="hover:text-brand-gold transition-colors">Email</a></li>
                    <li><a href="#" className="hover:text-brand-gold transition-colors">LinkedIn</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.5em] font-bold text-brand-neutral/20">
              <span>© {new Date().getFullYear()} Lena Shaw.</span>
              <div className="flex gap-12">
                <Link href="/admin/blog" className="hover:text-brand-gold transition-colors">Admin Dashboard</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
