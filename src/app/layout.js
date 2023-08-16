import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Unimixer',
  description: 'UniMixer ($UNIMIX) is an Ethereum Protocol and Telegram Bot that provides revenue share to $UNIMIX holders with $UNI & $UNIBOT rewards
  ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
