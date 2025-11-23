"use client"

import { AlertDialog, Button, Card, Flex, Grid } from "@radix-ui/themes"
import Link from "next/link"
import { MomentCategory } from "../../components/MomentCategory"
import {
  EyeOpenIcon,
  Pencil2Icon,
  PlusIcon,
  TrashIcon
} from "@radix-ui/react-icons"
import { useState } from "react"
import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import Spinner from "@/app/components/Spinner"

export default function AllMoments() {
  const { data: session } = useSession()
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null)
  const [viewMoment, setViewMoment] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const queryClient = useQueryClient()

  // get all moments
  const { data: moments, isLoading } = useQuery({
    queryKey: ["moments"],
    queryFn: async () => {
      const response = await axios.get("/api/moment/")
      return response.data
    },
    enabled: true
  })

  // view specific moment
  const { data: viewMoments } = useQuery({
    queryKey: ["moments", viewMoment],
    queryFn: () =>
      axios.get("/api/moment/" + viewMoment).then((res) => res.data),
    enabled: !!viewMoment
  })

  const deleteMutation = useMutation({
    mutationFn: async (momentId: number) => {
      return await axios.delete(`/api/moment/${momentId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moments"] })
    },
    onError: () => {
      setError(true)
    }
  })

  const handleDelete = () => {
    if (selectedMoment !== null) {
      deleteMutation.mutate(selectedMoment, {
        onSuccess: () => {
          setSelectedMoment(null)
        }
      })
    }
  }

  const sortedMoments = moments
    ? [...moments].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="md:px-12 p-8">
        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <p className="text-3xl font-bold text-slate-800">اللحظات</p>
          <Link
            href="/moments/new"
            className="flex items-center bg-[#796fc1] text-white py-2 px-5 rounded-full 
                       hover:bg-[#6a5ad9] transition shadow-sm hover:shadow-md"
          >
            <PlusIcon className="ml-2 h-4 w-4" /> أضِف لحظة جديدة
          </Link>
        </div>

        {/* Moments Grid */}
        {sortedMoments.length > 0 ? (
          <Grid
            columns={{ initial: "1", md: "2", lg: "3" }}
            gap="6"
            className="w-full"
          >
            {sortedMoments.map((moment: any) => (
              <Card
                key={moment.id}
                className="p-5 bg-white rounded-2xl border border-[#e3e6fb]
                           shadow-sm hover:shadow-md hover:border-[#796fc1]/50 
                           transition"
              >
                {/* التاريخ + التصنيف */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-slate-400">
                    {dayjs(moment.createdAt).format("DD/MM/YYYY")}
                  </span>
                  <MomentCategory
                    category={moment.category}
                    date={moment.createdAt}
                  />
                </div>

                {/* المحتوى */}
                <p className="text-sm text-slate-800 leading-relaxed line-clamp-3 mb-4">
                  {moment.content}
                </p>

                {/* الأزرار */}
                {session && (
                  <div className="flex gap-4 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => setViewMoment(moment.id)}
                      className="flex items-center gap-1 cursor-pointer hover:text-[#796fc1]"
                    >
                      <EyeOpenIcon className="h-4 w-4" /> عرض
                    </button>

                    <Link
                      href={`/moments/${moment.id}/edit`}
                      className="flex items-center gap-1 hover:text-[#796fc1]"
                    >
                      <Pencil2Icon className="h-4 w-4" /> تعديل
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedMoment(moment.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" /> حذف
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </Grid>
        ) : (
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <p className="text-slate-500 mb-2">لم يتم إنشاء أي لحظة بعد.</p>
            <Link
              href="/moments/new"
              className="text-xs text-[#796fc1] hover:underline"
            >
              اكتب لحظتك الأولى الآن ✨
            </Link>
          </div>
        )}
      </div>

      {/* حذف لحظة */}
      <AlertDialog.Root
        open={!!selectedMoment}
        onOpenChange={() => setSelectedMoment(null)}
      >
        <AlertDialog.Content maxWidth="400px" className="rounded-2xl">
          <AlertDialog.Title className="text-center text-lg font-semibold">
            حذف اللحظة
          </AlertDialog.Title>
          <AlertDialog.Description
            size="2"
            className="my-6 text-center text-slate-600"
          >
            هل تريد حذف هذه اللحظة؟ لن تتمكن من استعادتها بعد الحذف.
          </AlertDialog.Description>

          <Flex gap="3" mt="2" justify="center">
            <AlertDialog.Cancel>
              <Button
                variant="soft"
                color="gray"
                className="cursor-pointer rounded-full px-5"
              >
                إلغاء
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                className="cursor-pointer bg-red-600 hover:bg-red-700 rounded-full px-5"
                onClick={handleDelete}
              >
                حذف
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Error Dialog */}
      <AlertDialog.Root open={error}>
        <AlertDialog.Content className="rounded-2xl">
          <AlertDialog.Title>حدث خطأ ما</AlertDialog.Title>
          <AlertDialog.Description>
            لا يمكن حذف هذه اللحظة في الوقت الحالي.
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="3"
            onClick={() => setError(false)}
          >
            موافق
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* View Moment Dialog */}
      <AlertDialog.Root
        open={!!viewMoment}
        onOpenChange={() => setViewMoment(null)}
      >
        <AlertDialog.Content
          className="bg-white rounded-3xl shadow-xl p-8 max-w-xl w-full
               max-h-[80vh] flex flex-col"
        >
          {/* العنوان */}
          <AlertDialog.Title className="text-center text-lg font-semibold mb-3">
            تم تسجيل هذه اللحظة في
            <span className="mx-1 text-[#796fc1]">
              {viewMoments && dayjs(viewMoments.createdAt).format("DD/MM/YYYY")}
            </span>
          </AlertDialog.Title>

          {/* المحتوى مع Scroll */}
          <div
            className="text-slate-700 leading-relaxed text-sm overflow-y-auto 
                 pr-1"
            style={{ maxHeight: "60vh" }}
          >
            {viewMoments?.content}
          </div>

          {/* زر الرجوع */}
          <div className="mt-6 flex justify-center">
            <AlertDialog.Cancel>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 
                           py-2 px-6 rounded-full cursor-pointer text-sm"
              >
                رجوع
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}
