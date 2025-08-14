import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Donny Smith - Digital Branding & AI',
  description: 'Meet Donny through his AI assistant. Learn about his work in digital branding, crypto investments, and AI projects.',
  openGraph: {
    title: 'Donny Smith - Digital Branding & AI',
    description: 'Chat with Donny\'s AI assistant to learn about his work and get in touch',
    url: 'https://donnysmith.com',
    siteName: 'Donny Smith',
    images: [
      {
        url: 'https://donnysmith.com/og.png',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donny Smith - Digital Branding & AI',
    description: 'Chat with Donny\'s AI assistant to learn about his work and get in touch',
    images: ['https://donnysmith.com/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}