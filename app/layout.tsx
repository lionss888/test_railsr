import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainSidebar } from "@/components/main-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Railsr API Service",
  description: "Финансовый сервис на базе Railsr API",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <MainSidebar />
              <SidebarInset>
                <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
                  <div className="hidden md:block">
                    <SidebarTrigger />
                  </div>
                  <div className="md:hidden">
                    <MobileNav />
                  </div>
                  <div className="flex-1" />
                </header>
                <main className="flex-1">{children}</main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
