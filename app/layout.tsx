import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Donny Smith - AI Assistant',
  description: 'Chat with Donny\'s AI assistant to learn about his work and get in touch',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}