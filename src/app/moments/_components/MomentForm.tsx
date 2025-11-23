"use client"

import { InfoCircledIcon, MagicWandIcon } from "@radix-ui/react-icons"
import { Button, Callout } from "@radix-ui/themes"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import ErrorMassage from "@/app/components/ErrorMassage"
import { Moment } from "@prisma/client"
import { momentSchema } from "@/app/validationSchema"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import Spinner from "@/app/components/Spinner"
import useAssistantStore from "@/app/store/assistantStore"

type MomentFormData = z.infer<typeof momentSchema>

export default function MomentForm({ moment }: { moment?: Moment }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<MomentFormData>({
    resolver: zodResolver(momentSchema),
    defaultValues: {
      groupId: moment?.groupId?.toString(),
      category: moment?.category ?? undefined
    }
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showGrouping, setShowGrouping] = useState(() => !!moment?.groupId)

  const selectedGroupId = watch("groupId")
  const newGroupName = watch("newGroupName")

  const { toggleAssistant } = useAssistantStore()

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await axios.get("/api/groups/")
      return response.data
    }
  })

  const todayLabel = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true)

      const requestData: any = {
        content: data.content,
        category: data.category
      }

      if (data.newGroupName) {
        requestData.name = data.newGroupName
      } else if (data.groupId) {
        requestData.groupId = data.groupId
      }

      if (moment) {
        await axios.patch("/api/moment/" + moment.id, requestData)
        toast.success("تم تعديل اللحظة بنجاح")
        router.push("/moments")
      } else {
        await axios.post("/api/moment/", requestData)

        const quoteResponse = await axios.get(
          `/api/quote?category=${data.category}`
        )
        const quote = quoteResponse.data.quote

        router.push(
          `/moments/quote?quote=${encodeURIComponent(quote.content)}&category=${
            data.category
          }`
        )
      }

      router.refresh()
    } catch (err) {
      setIsSubmitting(false)
      setError("حدث خطأ ما، حاول مرة أخرى.")
    }
  })

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f2f7fb] flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-5">
        {/* الهيدر */}
        <header className="text-center space-y-1">
          <p className="text-[11px] text-slate-500">{todayLabel}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {moment ? "حدّث لحظتك" : "اكتبي لحظة من يومك"}
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            فكّري فيها كصفحة من دفتر خاص فيك، وليست نموذج أسئلة.
          </p>
        </header>

        {error && (
          <Callout.Root color="red">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* مساحة الكتابة */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">
                  ما الذي تحبين كتابته الآن؟
                </span>
                <MagicWandIcon
                  className="text-[#f4c35b] h-4 w-4 cursor-pointer"
                  onClick={toggleAssistant}
                />
              </div>
              <span className="hidden md:inline-block text-[11px] text-slate-400">
                اكتبي كما لو كنتِ تهمسين لنفسك.
              </span>
            </div>

            <textarea
              {...register("content")}
              defaultValue={moment?.content}
              className="w-full min-h-[230px] rounded-3xl border border-[#dcdff5]
                         bg-white/95 backdrop-blur-sm shadow-sm
                         p-5 text-sm md:text-base leading-relaxed resize-y
                         focus:outline-none focus:ring-2 focus:ring-[#796fc1]/40 focus:border-[#796fc1]"
              placeholder="اليوم صار كذا... أو حسّيت بشعور معيّن... أو حتى ملاحظة صغيرة تحبين تحتفظين فيها لنفسك."
            />
            <div className="mt-1 text-[11px] text-slate-400">
              اكتبي جملة، فقرة، أو صفحة كاملة… كلّه مقبول 💜
            </div>
            <ErrorMassage>{errors?.content?.message}</ErrorMassage>
          </div>

          {/* المشاعر */}
          <div>
            <p className="text-sm text-slate-700 mb-2">
              اختاري شعور اللحظة (اختياري):
            </p>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="HAPPY"
                  {...register("category", {
                    required: "اختر حالة اللحظة"
                  })}
                  className="peer sr-only"
                />
                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#dcdff5]
                             bg-white text-sm shadow-sm
                             hover:border-[#796fc1]/60 hover:bg-[#f0edff]
                             peer-checked:bg-[#796fc1] peer-checked:text-white peer-checked:border-transparent transition"
                >
                  <span>😊</span>
                  <span>لحظة سعيدة</span>
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="NORMAL"
                  {...register("category", {
                    required: "اختر حالة اللحظة"
                  })}
                  className="peer sr-only"
                />
                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#dcdff5]
                             bg-white text-sm shadow-sm
                             hover:border-[#796fc1]/60 hover:bg-[#f0edff]
                             peer-checked:bg-[#796fc1] peer-checked:text-white peer-checked:border-transparent transition"
                >
                  <span>🙂</span>
                  <span>لحظة عادية</span>
                </span>
              </label>
            </div>
            <ErrorMassage>{errors?.category?.message}</ErrorMassage>
          </div>

          {/* تنظيم في مجموعات – مخفف */}
          <div className="border-t border-[#e3e6fb] pt-4">
            <button
              type="button"
              onClick={() => setShowGrouping((prev) => !prev)}
              className="text-xs text-[#796fc1] flex items-center gap-1"
            >
              <span>
                {showGrouping
                  ? "إخفاء تنظيم اللحظة"
                  : "تنظيم اللحظة في مجموعة (اختياري)"}
              </span>
            </button>

            {showGrouping && (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {/* مجموعة موجودة */}
                <div>
                  <label
                    className={`block mb-1 text-xs font-medium ${
                      newGroupName ? "text-slate-400" : "text-slate-700"
                    }`}
                  >
                    إضافة إلى مجموعة موجودة
                  </label>
                  <select
                    disabled={!!newGroupName}
                    {...register("groupId")}
                    className="w-full rounded-xl border border-[#dcdff5] bg-white p-2.5 text-sm
                               shadow-sm focus:outline-none focus:ring-2 focus:ring-[#796fc1]/40 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">بدون مجموعة</option>
                    {groups?.map((group: { id: number; name: string }) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* مجموعة جديدة */}
                <div>
                  <label
                    className={`block mb-1 text-xs font-medium ${
                      selectedGroupId ? "text-slate-400" : "text-slate-700"
                    }`}
                  >
                    إنشاء مجموعة جديدة
                  </label>
                  <input
                    disabled={!!selectedGroupId}
                    {...register("newGroupName")}
                    type="text"
                    placeholder="مثال: لحظات الامتنان، لحظات 2025..."
                    className="w-full rounded-xl border border-[#dcdff5] bg-white p-2.5 text-sm
                               shadow-sm focus:outline-none focus:ring-2 focus:ring-[#796fc1]/40 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    لو ما اخترتِ ولا مجموعة، بتنحفظ اللحظة في قائمتك العادية.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* زر الحفظ */}
          <div className="pt-2">
            <Button
              size="3"
              className="w-full bg-[#796fc1] text-white cursor-pointer border-none 
                         font-semibold py-3 rounded-2xl 
                         hover:bg-[#6a5ad9] transition duration-200 ease-in-out
                         shadow-md hover:shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> <span>جاري الحفظ...</span>
                </span>
              ) : moment ? (
                "حفظ التعديل"
              ) : (
                "حفظ اللحظة"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
