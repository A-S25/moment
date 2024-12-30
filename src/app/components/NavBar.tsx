"use client"
import { AvatarIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button, DropdownMenu, TabNav, Text } from "@radix-ui/themes"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useThemeStore } from "../store/themeStore"

export default function NavBar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()

  return (
    <>
      <TabNav.Root
        size="2"
        color="indigo"
        // className="!pt-4 !px-10 !flex-row !justify-between "
        className={`!pt-4 !px-10 !flex-row !justify-between ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-[#ffffff] text-black"
        }`}
      >
        <div className="flex gap-2 items-center">
          <TabNav.Link asChild active={pathname === "/"}>
            <Link
              href="/"
              // className="!text-[#6200E8]"
              className={`${
                theme === "dark" ? " text-white" : "!text-[#6200E8]"
              }`}
            >
              الرئيسية
            </Link>
          </TabNav.Link>
          {session && (
            <>
              <TabNav.Link asChild active={pathname.startsWith("/moments")}>
                <Link
                  href="/moments"
                  className={`${
                    theme === "dark" ? " text-white" : "!text-[#6200E8]"
                  }`}
                >
                  اللحظات
                </Link>
              </TabNav.Link>
              <TabNav.Link asChild active={pathname.startsWith("/groups")}>
                <Link
                  href="/groups"
                  className={`${
                    theme === "dark" ? " text-white" : "!text-[#6200E8]"
                  }`}
                >
                  المجموعات
                </Link>
              </TabNav.Link>
            </>
          )}
        </div>

        {status === "authenticated" && (
          <div className="flex gap-2 items-center">
            {/* <div>
              <p
                onClick={toggleTheme}
                className={`${
                  theme === "dark" ? " !text-[#e8d846]" : "text-black"
                }`}
              >
                {theme === "light" ? (
                  <MoonIcon className="h-6 w-6" />
                ) : (
                  <SunIcon className="h-6 w-6" />
                )}
              </p>
            </div> */}

            <TabNav.Link asChild>
              <DropdownMenu.Root
                key={open ? "open" : "closed"}
                open={open}
                onOpenChange={setOpen}
              >
                <DropdownMenu.Trigger>
                  <AvatarIcon
                    className={`!cursor-pointer w-6 h-6 ${
                      theme === "dark" ? "text-white " : "text-[#6200E8] "
                    }`}
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Label>
                    <Text slot="2">{session?.user?.email}</Text>
                  </DropdownMenu.Label>
                  <DropdownMenu.Item className="hover:bg-[#ece0fc] hover:text-white">
                    <Link
                      href="/api/auth/signout"
                      className="!cursor-pointer !rounded-lg text-[#6200E8]"
                    >
                      تسجيل الخروج
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </TabNav.Link>
          </div>
        )}

        {status === "unauthenticated" && (
          <TabNav.Link asChild>
            <Link
              href="/api/auth/signin"
              className="!cursor-pointer  !bg-transparent !rounded-lg !text-[#6200E8]"
            >
              تسجيل الدخول
            </Link>
          </TabNav.Link>
        )}
      </TabNav.Root>
    </>
  )
}
