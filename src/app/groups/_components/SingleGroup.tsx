"use client";

import { AlertDialog, Button, Card, Flex, Grid } from "@radix-ui/themes";
import { EyeOpenIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/app/components/Spinner";
import dayjs from "dayjs";
import { MomentCategory } from "@/app/components/MomentCategory";

type SingleGroupProps = {
  params: { id: string };
};

export default function SingleGroup({ params }: SingleGroupProps) {
  const groupId = params.id;
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null);
  const [viewMoment, setViewMoment] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();

  // جلب بيانات المجموعة + اللحظات التابعة لها
  const { data: group, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${groupId}`);
      return response.data;
    },
    enabled: !!groupId
  });

  // جلب تفاصيل لحظة محددة للعرض في الـ Dialog
  const { data: viewMomentData } = useQuery({
    queryKey: ["moment", viewMoment],
    queryFn: () =>
      axios.get(`/api/moment/${viewMoment}`).then((res) => res.data),
    enabled: !!viewMoment
  });

  // حذف لحظة
  const deleteMutation = useMutation({
    mutationFn: async (momentId: number) => {
      return await axios.delete(`/api/moment/${momentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      setSelectedMoment(null);
    },
    onError: () => {
      setError(true);
    }
  });

  const handleDelete = () => {
    if (selectedMoment !== null) {
      deleteMutation.mutate(selectedMoment);
    }
  };

  if (!groupId) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f2f7fb] flex items-center justify-center">
        <p className="text-slate-600">حدث خطأ في قراءة معرف المجموعة.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  const hasMoments = group?.moments && group.moments.length > 0;

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] bg-[#f2f7fb] px-12 py-10">
        <div className=" mx-auto">
          {/* رأس الصفحة */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                {group.name}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-500">
                تحتوي هذه المجموعة على{" "}
                <span className="font-medium text-slate-700">
                  {group.moments.length}
                </span>{" "}
                {group.moments.length === 1 ? "لحظة" : "لحظات"}.
              </p>
            </div>

            <Link
              href="/groups"
              className="text-xs md:text-sm text-[#796fc1] hover:text-[#6a5ad9] hover:underline"
            >
              العودة إلى جميع المجموعات
            </Link>
          </div>

          {/* شبكة اللحظات */}
          {hasMoments ? (
            <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="6">
              {group.moments.map((moment: any) => (
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
                  <div className="flex gap-4 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => setViewMoment(moment.id)}
                      className="flex items-center gap-1 cursor-pointer hover:text-[#796fc1]"
                    >
                      <EyeOpenIcon className="h-4 w-4" />
                      <span>عرض</span>
                    </button>

                    <Link
                      href={`/moments/${moment.id}/edit`}
                      className="flex items-center gap-1 hover:text-[#796fc1]"
                    >
                      <Pencil2Icon className="h-4 w-4" />
                      <span>تعديل</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedMoment(moment.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>حذف</span>
                    </button>
                  </div>
                </Card>
              ))}
            </Grid>
          ) : (
            <div className="flex flex-col justify-center items-center h-48 text-center">
              <p className="text-slate-500 mb-2">
                لا توجد لحظات مرتبطة بهذه المجموعة حتى الآن.
              </p>
              <Link
                href="/moments/new"
                className="text-xs text-[#796fc1] hover:underline"
              >
                أضف لحظة جديدة إلى هذه المجموعة من صفحة إنشاء اللحظات ✨
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* حوار حذف لحظة */}
      <AlertDialog.Root
        open={!!selectedMoment}
        onOpenChange={(open) => {
          if (!open) setSelectedMoment(null);
        }}
      >
        <AlertDialog.Content maxWidth="450px" className="rounded-2xl">
          <AlertDialog.Title className="text-center text-lg font-semibold">
            حذف اللحظة
          </AlertDialog.Title>
          <AlertDialog.Description
            size="2"
            className="my-6 text-center text-slate-600"
          >
            هل تريد حذف هذه اللحظة؟ هي جزء من رحلتك.
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

      {/* حوار الخطأ */}
      <AlertDialog.Root
        open={error}
        onOpenChange={(open) => {
          if (!open) setError(false);
        }}
      >
        <AlertDialog.Content maxWidth="350px" className="rounded-2xl">
          <AlertDialog.Title className="text-center text-lg font-semibold">
            حدث خطأ ما
          </AlertDialog.Title>
          <AlertDialog.Description className="my-4 text-center text-slate-600">
            لا يمكن حذف هذه اللحظة حاليًا. يرجى المحاولة مرة أخرى.
          </AlertDialog.Description>
          <Flex justify="center" mt="2">
            <Button
              color="gray"
              variant="soft"
              className="cursor-pointer rounded-full px-5"
              onClick={() => setError(false)}
            >
              موافق
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* حوار عرض اللحظة */}
      <AlertDialog.Root
        open={!!viewMoment}
        onOpenChange={(open) => {
          if (!open) setViewMoment(null);
        }}
      >
        <AlertDialog.Content className="bg-white rounded-2xl shadow-lg p-6 max-w-xl">
          <AlertDialog.Title className="text-xl font-bold text-slate-800 mb-4 text-center">
            تم تسجيل هذه اللحظة في
            <span className="mx-2 text-[#796fc1]">
              {viewMomentData &&
                dayjs(viewMomentData.createdAt).format("DD/MM/YYYY")}
            </span>
          </AlertDialog.Title>

          <AlertDialog.Description className="text-slate-700 text-center mb-6 leading-relaxed max-h-[60vh] overflow-y-auto">
            {viewMomentData?.content}
          </AlertDialog.Description>

          <div className="flex justify-center">
            <AlertDialog.Cancel>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-5 rounded-full cursor-pointer">
                الرجوع
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}
