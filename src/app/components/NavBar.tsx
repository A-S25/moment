"use client"

import { AvatarIcon } from "@radix-ui/react-icons"
import { DropdownMenu, Text } from "@radix-ui/themes"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useThemeStore } from "../store/themeStore"

export default function NavBar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const { theme } = useThemeStore()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const baseBg =
    theme === "dark" ? "bg-slate-950 text-white" : "bg-[#f2f7fb] text-slate-800"

  return (
    <header className={`${baseBg}`}>
      <div className="mx-auto flex items-center justify-between px-12 py-4">
        {/* الروابط */}
        <nav className="flex gap-6 text-sm md:text-base">
          <Link
            href="/"
            className={`pb-1 border-b-2 transition-colors ${
              isActive("/")
                ? "border-[#796fc1] text-[#796fc1]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            الرئيسية
          </Link>

          {status === "authenticated" && (
            <>
              <Link
                href="/moments"
                className={`pb-1 border-b-2 transition-colors ${
                  isActive("/moments")
                    ? "border-[#796fc1] text-[#796fc1]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                اللحظات
              </Link>

              <Link
                href="/groups"
                className={`pb-1 border-b-2 transition-colors ${
                  isActive("/groups")
                    ? "border-[#796fc1] text-[#796fc1]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                المجموعات
              </Link>
            </>
          )}
        </nav>

        {/* يمين الناف */}
        {status === "authenticated" && (
          <DropdownMenu.Root
            key={open ? "open" : "closed"}
            open={open}
            onOpenChange={setOpen}
          >
            <DropdownMenu.Trigger>
              <AvatarIcon className="cursor-pointer w-6 h-6 z-10" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>
                <Text>{session?.user?.email}</Text>
              </DropdownMenu.Label>
              <DropdownMenu.Item>
                <Link
                  href="/api/auth/signout"
                  className="cursor-pointer rounded-lg text-[#796fc1]"
                >
                  تسجيل الخروج
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        {status === "unauthenticated" && (
          <Link
            href="/api/auth/signin"
            className="text-sm md:text-base text-[#796fc1] hover:text-[#5f54d9] font-medium"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </header>
  )
}
