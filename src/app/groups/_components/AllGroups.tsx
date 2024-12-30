"use client"

import { Card, Grid, Button, AlertDialog, Flex } from "@radix-ui/themes"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import Link from "next/link"
import Spinner from "@/app/components/Spinner"
import { Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"

export default function GroupsList() {
  const queryClient = useQueryClient()
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<any>(null) // لحالة التعديل
  const [selectedGroupForDelete, setSelectedGroupForDelete] =
    useState<any>(null) // لحالة الحذف
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [open, setOpen] = useState(false) // التحكم بفتح/إغلاق النافذة
  const [groupName, setGroupName] = useState("") // لتخزين اسم المجموعة الجديدة

  // إضافة مجموعة جديدة
  const addGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      return await axios.post("/api/groups/", { name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] }) // تحديث قائمة المجموعات
      setGroupName("") // تفريغ الحقل
      setOpen(false) // إغلاق النافذة
    }
  })

  const handleAddGroup = () => {
    addGroupMutation.mutate(groupName.trim())
  }

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

  // حذف مجموعة
  const deleteMutation = useMutation({
    mutationFn: async (groupId: number) => {
      return await axios.delete(`/api/groups/${groupId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] }) // تحديث قائمة المجموعات
      setShowDeleteDialog(false) // إغلاق النافذة المنبثقة
    }
  })

  // تعديل اسم المجموعة
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      return await axios.patch(`/api/groups/${id}`, { name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] }) // تحديث القائمة
      setSelectedGroupForEdit(null) // مسح المجموعة المختارة للتعديل
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
      <div className="text-red-500 text-center">
        حدث خطأ أثناء جلب البيانات.
      </div>
    )
  }

  return (
    <>
      <div className="p-8">
        <div className="mb-16 flex justify-between items-center">
          <p className="text-3xl font-bold">المجموعات</p>
          <div
          
          className="flex items-center bg-[#6200E8] text-white py-2 px-4 rounded-full  hover:bg-[#5300c8] transition cursor-pointer"
          onClick={() => setOpen(true)} // فتح نافذة إضافة المجموعة
          >
            <PlusIcon  className="ml-3" /> أضف مجموعة جديدة
          </div>
        </div>
        <Grid columns={{ initial: "1", md: "3", lg: "4" }} gap="6">
          {groups.map((group: any) => (
            <Card
              key={group.id}
              className="p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* تفاصيل المجموعة */}
              <div className="flex justify-between">
                <h3 className="text-lg font-bold mb-2">{group.name}</h3>
                {group._count.moments != 0 ? (
                  <Link href={`/groups/${group.id}`}>
                    <p className="bg-gray-200 mb-4 rounded-md w-12 text-center">
                      {group._count.moments}
                    </p>
                  </Link>
                ) : (
                  <p className="text-gray-500 text-sm">لا يوجد لحظات</p>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-row-reverse gap-3">
                {/* تعديل المجموعة */}
                <Pencil2Icon
                  onClick={() => setSelectedGroupForEdit(group)}
                  className="cursor-pointer w-5 h-5 text-green-600 hover:text-green-700 transition-transform transform hover:scale-110"
                />

                {/* حذف المجموعة */}
                <TrashIcon
                  className="cursor-pointer w-5 h-5 text-red-600 hover:text-red-700 transition-transform transform hover:scale-110"
                  onClick={() => {
                    setSelectedGroupForDelete(group)
                    setShowDeleteDialog(true)
                  }}
                />
              </div>
            </Card>
          ))}
        </Grid>
      </div>

      <AlertDialog.Root
        open={selectedGroupForEdit}
        onOpenChange={() => setSelectedGroupForEdit(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>تعديل اسم المجموعة</AlertDialog.Title>
          <div className="mt-11">
            <input
              type="text"
              defaultValue={selectedGroupForEdit?.name}
              onChange={(e) =>
                setSelectedGroupForEdit({
                  ...selectedGroupForEdit,
                  name: e.target.value
                })
              }
              className="border rounded-md p-2 w-full mb-4"
            />
            <Flex gap="3" mt="4" justify="center">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray" className="cursor-pointer">
                  الرجوع
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button
                  variant="solid"
                  className="cursor-pointer bg-red-600"
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedGroupForEdit.id,
                      name: selectedGroupForEdit.name
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

      {/* تأكيد حذف المجموعة */}
      <AlertDialog.Root
        open={showDeleteDialog}
        onOpenChange={() => setShowDeleteDialog(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>حذف المجموعة</AlertDialog.Title>
          <AlertDialog.Description size="2" className="my-8">
            هل أنت متأكد أنك تريد حذف هذه المجموعة؟ سيتم حذف جميع اللحظات
            المرتبطة بها أيضًا.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="center">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" className="cursor-pointer">
                الرجوع
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                className="cursor-pointer bg-red-600"
                onClick={() => deleteMutation.mutate(selectedGroupForDelete.id)}
              >
                حذف
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* نافذة Add new Group name */}
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Content className="">
          <AlertDialog.Title className="text-xl font-bold mb-4">
            إضافة مجموعة جديدة
          </AlertDialog.Title>
          <div className="mt-11">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="اسم المجموعة"
              className="border rounded-md p-2 w-full mb-4"
            />

            <Flex gap="3" mt="4" justify="center">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray" className="cursor-pointer">
                  إلغاء
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button
                  variant="solid"
                  className="cursor-pointer bg-[#6200E8] disabled:bg-slate-300 disabled:text-slate-500"
                  onClick={handleAddGroup}
                  disabled={!groupName}
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
