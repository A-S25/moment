"use client"
import { InfoCircledIcon, LightningBoltIcon, MagicWandIcon } from "@radix-ui/react-icons"
import { Button, Callout, TextArea } from "@radix-ui/themes"
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
      groupId: moment?.groupId?.toString()
    }
  })
  const [error, setError] = useState("")
  const [isSubmitting, seSubmitting] = useState(false)
  const selectedGroupId = watch("groupId")
  const newGroupName = watch("newGroupName")
  const { isOpen, currentQuestion, toggleAssistant, getNewQuestion } =
    useAssistantStore()

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await axios.get("/api/groups/")
      return response.data
    }
  })

  console.log(groups)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  const OnSubmit = handleSubmit(async (data) => {
    try {
      seSubmitting(true)

      const requestData: any = {
        content: data.content,
        category: data.category
      }

      // إذا كان المستخدم قد أدخل اسم مجموعة جديدة
      if (data.newGroupName) {
        requestData.name = data.newGroupName // سيتم إرسال الاسم للباكند لإنشاء مجموعة جديدة
      } else if (data.groupId) {
        requestData.groupId = data.groupId // سيتم إرسال معرّف المجموعة الموجودة
      }

      if (moment) {
        await axios.patch("/api/moment/" + moment.id, requestData)
        toast.success("تم تعديل اللحظه بنجاح")
        router.push("/moments")
      } else {
        /*
       1- post اولا يتم ارسال الداتا 
       2- يتم جلب التصنيف ع حسب النوع اللذي تم ارساله مع الفورم 
       3- ?quote= 
          هذه الكلمه لا يستقبلها الباكند انما هي بالفرونت فقط لي نعرض المحتوى للمستخدم
       4-&category=
          هذه الكلمه يستقبلها الباكند ويستخدمها للبحث عن الاقتباسات للتصنيف
  */

        await axios.post("/api/moment/", requestData)

        // toast.success("تم اضافة اللحظه بنجاح")

        // get quote from api and redirect to quote page with quote content as query param
        const quoteResponse = await axios.get(
          `/api/quote?category=${data.category}`
        )
        const quote = quoteResponse.data.quote
        // توجيه المستخدم إلى صفحة الاقتباس مع الاقتباس المسترجع
        router.push(
          `/moments/quote?quote=${encodeURIComponent(quote.content)}&category=${
            data.category
          }`
        )
      }

      router.refresh()
    } catch (error) {
      seSubmitting(false)
      setError("حدث خطأ ما")
    }
  })

  return (
    <>
      <div className="flex items-center justify-center  p-8">
        <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200 ">
          {error && (
            <Callout.Root color="red">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
          <form onSubmit={OnSubmit}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {moment ? "تعديل اللحظه" : "اضافة لحظة جديدة"}
            </h1>
            <div className="mb-3">
              <div className="flex gap-2 items-baseline">
                <label className="block text-gray-700 mb-2">
                  ما الذي حدث اليوم؟
                </label>
                <MagicWandIcon
                  className="text-yellow-400 h-4 w-4 cursor-pointer"
                  onClick={toggleAssistant}
                />
              </div>

              <TextArea
                {...register("content")}
                className="w-full  h-52 rounded-lg p-4 focus:ring-2 focus:ring-[#6200E8]  focus:outline-none "
                placeholder="اكتب هنا بما مررت به اليوم ..."
                defaultValue={moment?.content}
              ></TextArea>
              <ErrorMassage>{errors?.content?.message}</ErrorMassage>
            </div>

            <div className="my-6">
              <label className="block text-gray-700 mb-2">
                كيف تصف هذه اللحظة؟
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    defaultChecked={moment?.category === "HAPPY"}
                    type="radio"
                    id="happy"
                    value="HAPPY"
                    {...register("category", { required: "اختر حاله اللحظه" })}
                    className="mr-2"
                  />
                  كانت لحظة سعيدة
                </label>

                <label className="flex items-center gap-2">
                  <input
                    defaultChecked={moment?.category === "NORMAL"}
                    type="radio"
                    id="neutral"
                    value="NORMAL"
                    {...register("category", { required: "اختر حاله اللحظه" })}
                    className="mr-2"
                  />
                  كانت لحظة عادية
                </label>
                <ErrorMassage>{errors?.category?.message}</ErrorMassage>
              </div>
            </div>
            <hr className="my-4" />
            <div>
              هل تريد جمع هذه اللحظه مع لحظات اخرى ؟
              <span className="text-gray-400">(اختياري)</span>
            </div>

            {/* اختيار مجموعة موجودة */}
            <div className="my-2">
              <label
                className={`block mb-2 ${
                  newGroupName ? "text-gray-400" : "text-gray-700"
                }`}
              >
                إضافة إلى مجموعة موجودة
              </label>
              <select
                disabled={!!newGroupName}
                {...register("groupId")}
                className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-[#6200E8] disabled:text-gray-400 focus:outline-none"
              >
                <option value="">اختر</option>
                {groups?.map((group: { id: number; name: string }) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* إنشاء مجموعة جديدة */}
            <div className="mb-9">
              <label
                className={`block mb-2 ${
                  selectedGroupId ? "text-gray-400" : "text-gray-700"
                }`}
              >
                إنشاء مجموعة جديدة
              </label>
              <input
                disabled={!!selectedGroupId}
                {...register("newGroupName")}
                type="text"
                placeholder="اسم المجموعة الجديدة"
                className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-[#6200E8] focus:outline-none peer"
              />
            </div>

            <Button
              size="3"
              className="bg-[#6200E8] text-white cursor-pointer  border font-semibold py-2 px-4 rounded-lg hover:bg-[#8c73b6]  transition duration-300 ease-in-out w-full"
              disabled={isSubmitting}
            >
              {moment ? "تعديل" : "اضافه"}
              {isSubmitting && <Spinner />}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
