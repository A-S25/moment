"use client"
import { Category } from "@prisma/client"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Badge } from "@radix-ui/themes"
import dayjs from "dayjs"
import "dayjs/locale/ar"

dayjs.locale("ar")

const categoryMap: Record<Category, { color: "green" | "blue" }> = {
  HAPPY: { color: "green" },
  NORMAL: { color: "blue" }
}

export const MomentCategory = ({
  category,
  date
}: {
  category?: Category
  date?: string
}) => {
  const formattedDate = dayjs(date).format("dddd, DD/MM/YYYY")

  if (category === undefined) {
    // Handle the case when category is undefined
    return null // or any other appropriate action
  }

  return (
    <div className="flex flex-col items-start">
      <Badge
        color={categoryMap[category].color}
        className="text-sm font-medium px-2.5 py-0.5 rounded flex items-center"
      >
        <CalendarIcon className="text-black" />
        {formattedDate}
      </Badge>
    </div>
  )
}
