import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TradingView Clone - Advanced Charting Platform',
  description: 'Professional trading charts with advanced drawing tools',
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
