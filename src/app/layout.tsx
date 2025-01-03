import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
import NavBar from "./components/NavBar"
import AuthProvidor from "./auth/Providor"
import QueryClientProvider from "./QueryClientProvider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"
import Assistant from "./components/Assistant"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
})

export const metadata: Metadata = {
  title: "اللحظات",
  description: "Generated by create next app"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <Toaster />
        <QueryClientProvider>
          <AuthProvidor>
            <Theme className="bg-[#f4f4f4] min-h-screen">
              <NavBar />
              <div >{children}</div>
              <Assistant />
            </Theme>
          </AuthProvidor>
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </body>
    </html>
  )
}
