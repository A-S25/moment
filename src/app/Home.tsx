"use client"
import { Container } from "@radix-ui/themes"
import { QuoteIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useThemeStore } from "./store/themeStore"

export default function Home() {
    const { theme } = useThemeStore()
  
  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 ">
        <Container className="flex flex-col items-center justify-center text-center z-0 md:mt-72 mt-40">
          <h1 className="text-[3rem] text-[#2c4059] flex gap-3">
            <QuoteIcon className="text-[#6200E8] h-6 w-6" />
            اللحظات تذهب و الكلمات تبقيها حيه
            <QuoteIcon className="text-[#6200E8] h-6 w-6" />
          </h1>
          <p className="mt-4 mb-7 text-[#9fa9bf] text-xl">
            سجل لحظاتك اليومية ودعها تبقى معك ،، في مكان واحد
          </p>

          <Link
            href="/moments/new"
            className="cursor-pointer bg-[#6200E8] hover:bg-[#ffffff] rounded-lg mt-5 text-[#ffffff] hover:text-[#3240ff] border border-[#3240ff] py-3 px-8 transition duration-300 ease-in-out"
          >
            دوّنها الآن
          </Link>
        </Container>
      </div>
    </>
  )
}
