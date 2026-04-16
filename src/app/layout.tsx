import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "./globals.css";

import Header from "@/components/Header";
import { getCmsPage } from "@/app/actions/cms";
import { cmsData as localCmsData } from "@/lib/cms-data";

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
  title: "AcquireNow | Healthcare Marketing Leadership",
  description: "Healthcare marketing and product leader with 13+ years driving growth, launching products, and aligning cross-functional teams in complex organizations. Proven track record across digital health, value-based care, and enterprise GTM strategy.",
  icons: {
    icon: "/assets/a-logo.png",
  },
  openGraph: {
    title: "AcquireNow | Healthcare Marketing Leadership",
    description: "Healthcare marketing and product leader with 13+ years driving growth, launching products, and aligning cross-functional teams in complex organizations. Proven track record across digital health, value-based care, and enterprise GTM strategy.",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AcquireNow | Healthcare Marketing Leadership",
    description: "Healthcare marketing and product leader with 13+ years driving growth, launching products, and aligning cross-functional teams in complex organizations.",
    images: ["/assets/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cmsContent = await getCmsPage('global');
  
  const merge = (local: any, cms: any) => {
    if (!cms) return local;
    const result = { ...local };
    for (const key in cms) {
      if (cms[key] !== undefined && cms[key] !== null && cms[key] !== '') {
        result[key] = cms[key];
      }
    }
    return result;
  };

  const footer = merge(localCmsData.global.footer, cmsContent.footer);

  return (
    <html lang="en" className={cn("h-full", openSans.variable, montserrat.variable)}>
      <body className="min-h-full flex flex-col font-sans text-brand-dark bg-white">
        <Header data={footer} />
        <main className="flex-grow">{children}</main>
        <footer className="bg-[#1a191b] text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-plum opacity-5 skew-x-[-12deg] translate-x-20" />
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
              <div>
                <Link href="/" className="flex items-center gap-4 mb-8 group">
                  <div className="relative h-8 w-40">
                    <Image 
                      src="/assets/logo-white.png" 
                      alt="AcquireNow" 
                      fill
                      className="object-contain object-left opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </Link>
                <p className="text-brand-neutral/70 text-lg max-w-sm leading-relaxed italic border-l-2 border-brand-gold/80 pl-8">
                  {footer.tagline}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[12px] uppercase tracking-[0.5em] font-bold mb-8 text-brand-gold">{footer.navTitle}</h4>
                  <ul className="space-y-4 text-[12px] font-bold uppercase tracking-[0.4em]">
                    <li><Link href={footer.nav1Url} className="hover:text-brand-gold transition-colors">{footer.nav1Label}</Link></li>
                    <li><Link href={footer.nav2Url} className="hover:text-brand-gold transition-colors">{footer.nav2Label}</Link></li>
                    <li><Link href={footer.nav3Url} className="hover:text-brand-gold transition-colors">{footer.nav3Label}</Link></li>
                    <li><Link href={footer.nav4Url} className="hover:text-brand-gold transition-colors">{footer.nav4Label}</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[12px] uppercase tracking-[0.5em] font-bold mb-8 text-brand-gold">{footer.contactTitle}</h4>
                  <ul className="space-y-4 text-[12px] font-bold uppercase tracking-[0.4em]">
                    <li><a href={footer.emailUrl} className="hover:text-brand-gold transition-colors">{footer.emailLabel}</a></li>
                    <li><a href={footer.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">{footer.linkedinLabel}</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[12px] uppercase tracking-[0.5em] font-bold text-brand-neutral/60">
              <span>© {new Date().getFullYear()} {footer.copyrightText}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
