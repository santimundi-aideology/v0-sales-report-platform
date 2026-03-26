import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { InsightProvider } from '@/components/insights/insight-provider'
import { InsightAnnotator } from '@/components/insights/insight-annotator'
import { InsightToggle } from '@/components/insights/insight-toggle'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700'],
});
const firaCode = Fira_Code({ 
  subsets: ["latin"],
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: 'APCOM | Sales Report & Forecast Platform',
  description: 'Enterprise analytics and decision-support platform for sales, forecasting, inventory health, campaigns, and AI-generated business recommendations.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${firaCode.variable} font-sans antialiased`}>
        <InsightProvider>
          {children}
          <InsightAnnotator />
          <InsightToggle />
        </InsightProvider>
        <Analytics />
      </body>
    </html>
  )
}
