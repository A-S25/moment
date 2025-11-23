"use client"

import { AlertDialog, Button, Card, Flex, Grid } from "@radix-ui/themes"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import Link from "next/link"
import Spinner from "@/app/components/Spinner"
import {
  EyeOpenIcon,
  Pencil2Icon,
  PlusIcon,
  TrashIcon
} from "@radix-ui/react-icons"

export default function GroupsList() {
  const queryClient = useQueryClient()

  const [groupToEdit, setGroupToEdit] = useState<any | null>(null)
  const [groupToDelete, setGroupToDelete] = useState<any | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [groupName, setGroupName] = useState("")

  // جلب بيانات المجموعات
  const {
    data: groups,
    isLoading,
    error
  } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await axios.get("/api/groups/")
      return response.data
    }
  })

  // إضافة مجموعة جديدة
  const addGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      return await axios.post("/api/groups/", { name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      setGroupName("")
      setAddDialogOpen(false)
    }
  })

  const handleAddGroup = () => {
    const trimmed = groupName.trim()
    if (!trimmed) return
    addGroupMutation.mutate(trimmed)
  }

  // تعديل اسم المجموعة
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      return await axios.patch(`/api/groups/${id}`, { name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      setGroupToEdit(null)
    }
  })

  // حذف مجموعة
  const deleteMutation = useMutation({
    mutationFn: async (groupId: number) => {
      return await axios.delete(`/api/groups/${groupId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      setGroupToDelete(null)
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        حدث خطأ أثناء جلب البيانات.
      </div>
    )
  }

  const hasGroups = groups && groups.length > 0

  return (
    <>
      {/* نفس نمط صفحة اللحظات من ناحية الخلفية والـ padding */}
      <div className="min-h-[calc(100vh-80px)] bg-[#f2f7fb] px-4 md:px-12 py-10">
        {/* العنوان + زر الإضافة */}
        <div className="mb-10 flex justify-between items-center">
          <p className="text-3xl font-bold text-slate-800">المجموعات</p>
          <button
            type="button"
            className="flex items-center bg-[#796fc1] text-white py-2 px-5 rounded-full 
                       hover:bg-[#6a5ad9] transition shadow-sm hover:shadow-md text-sm"
            onClick={() => setAddDialogOpen(true)}
          >
            <PlusIcon className="ml-2 h-4 w-4" /> أضف مجموعة جديدة
          </button>
        </div>

        {/* قائمة المجموعات أو حالة فارغة */}
        {hasGroups ? (
          <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="6">
            {groups.map((group: any) => (
              <Card
                key={group.id}
                className="p-5 bg-white rounded-2xl border border-[#e3e6fb]
                           shadow-sm hover:shadow-md hover:border-[#796fc1]/50 
                           transition"
              >
                {/* اسم المجموعة + عدد اللحظات */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-slate-800">
                    {group.name}
                  </h3>

                  {group._count.moments > 0 ? (
                    <Link href={`/groups/${group.id}`}>
                      <span className="px-3 py-1 rounded-full bg-[#f3f0ff] text-xs text-[#796fc1] cursor-pointer">
                        {group._count.moments} لحظات
                      </span>
                    </Link>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-400">
                      لا توجد لحظات
                    </span>
                  )}
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-4 text-xs text-slate-500 mt-2">
                  {group._count.moments > 0 && (
                    <Link
                      href={`/groups/${group.id}`}
                      className="flex items-center gap-1 hover:text-[#796fc1]"
                    >
                      <EyeOpenIcon className="h-4 w-4" />
                      <span>عرض اللحظات</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setGroupToEdit(group)}
                    className="flex items-center gap-1 hover:text-[#796fc1]"
                  >
                    <Pencil2Icon className="h-4 w-4" />
                    <span>تعديل الاسم</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGroupToDelete(group)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>حذف المجموعة</span>
                  </button>
                </div>
              </Card>
            ))}
          </Grid>
        ) : (
          <div className="flex flex-col justify-center items-center h-48 text-center">
            <p className="text-slate-500 mb-2">
              لم يتم إنشاء أي مجموعة بعد.
            </p>
            <button
              type="button"
              onClick={() => setAddDialogOpen(true)}
              className="text-xs text-[#796fc1] hover:underline"
            >
              أنشئ أول مجموعة الآن ✨
            </button>
          </div>
        )}
      </div>

      {/* حوار تعديل اسم المجموعة */}
      <AlertDialog.Root
        open={!!groupToEdit}
        onOpenChange={(open) => {
          if (!open) setGroupToEdit(null)
        }}
      >
        <AlertDialog.Content maxWidth="400px" className="rounded-2xl">
          <AlertDialog.Title className="text-lg font-semibold mb-4">
            تعديل اسم المجموعة
          </AlertDialog.Title>

          <div className="mt-4">
            <input
              type="text"
              value={groupToEdit?.name ?? ""}
              onChange={(e) =>
                setGroupToEdit(
                  groupToEdit
                    ? { ...groupToEdit, name: e.target.value }
                    : groupToEdit
                )
              }
              className="border border-[#d7ddff] rounded-xl p-2.5 w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#796fc1]"
              placeholder="اسم المجموعة"
            />

            <Flex gap="3" mt="4" justify="center">
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
                  className="cursor-pointer bg-[#796fc1] hover:bg-[#6a5ad9] rounded-full px-5 disabled:bg-slate-300 disabled:text-slate-500"
                  disabled={!groupToEdit?.name?.trim()}
                  onClick={() =>
                    groupToEdit &&
                    updateMutation.mutate({
                      id: groupToEdit.id,
                      name: groupToEdit.name.trim()
                    })
                  }
                >
                  حفظ
                </Button>
              </AlertDialog.Action>
            </Flex>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* حوار تأكيد حذف المجموعة */}
      <AlertDialog.Root
        open={!!groupToDelete}
        onOpenChange={(open) => {
          if (!open) setGroupToDelete(null)
        }}
      >
        <AlertDialog.Content maxWidth="400px" className="rounded-2xl">
          <AlertDialog.Title className="text-center text-lg font-semibold">
            حذف المجموعة
          </AlertDialog.Title>
          <AlertDialog.Description
            size="2"
            className="my-6 text-center text-slate-600"
          >
            هل تريد حذف هذه المجموعة؟ سيتم حذف جميع اللحظات المرتبطة بها أيضًا.
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
                onClick={() =>
                  groupToDelete && deleteMutation.mutate(groupToDelete.id)
                }
              >
                حذف
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* حوار إضافة مجموعة جديدة */}
      <AlertDialog.Root
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      >
        <AlertDialog.Content maxWidth="400px" className="rounded-2xl">
          <AlertDialog.Title className="text-lg font-semibold mb-4">
            إضافة مجموعة جديدة
          </AlertDialog.Title>

          <div className="mt-4">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="اسم المجموعة"
              className="border border-[#d7ddff] rounded-xl p-2.5 w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#796fc1]"
            />

            <Flex gap="3" mt="4" justify="center">
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
                  className="cursor-pointer bg-[#796fc1] hover:bg-[#6a5ad9] rounded-full px-5 disabled:bg-slate-300 disabled:text-slate-500"
                  onClick={handleAddGroup}
                  disabled={!groupName.trim()}
                >
                  إضافة
                </Button>
              </AlertDialog.Action>
            </Flex>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}
