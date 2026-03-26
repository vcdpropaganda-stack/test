import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthErrorHandler } from "@/components/auth/auth-error-handler";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionOrchestrator } from "@/components/shared/motion-orchestrator";
import { RouteScrollReset } from "@/components/shared/route-scroll-reset";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VL Serviços | Marketplace de Serviços Locais",
  description:
    "Marketplace para conectar clientes a prestadores de serviços com agendamento, assinaturas e operação escalável.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthErrorHandler />
        <MotionOrchestrator />
        <RouteScrollReset />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
