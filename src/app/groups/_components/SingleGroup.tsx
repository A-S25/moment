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

export default function SingleGroup({ params }: { params: { id: string } }) {
  const { id } = params;
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null);
  const [viewMoment, setViewMoment] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();

  // جلب اللحظات الخاصة بالمجموعة
  const { data: group, isLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // حذف اللحظة
  const deleteMutation = useMutation({
    mutationFn: async (momentId: number) => {
      return await axios.delete(`/api/moment/${momentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", id] }); // تحديث بيانات المجموعة
    },
    onError: () => {
      setError(true);
    },
  });

  const handleDelete = () => {
    if (selectedMoment) {
      deleteMutation.mutate(selectedMoment, {
        onSuccess: () => {
          setSelectedMoment(null);
        },
      });
    }
  };

    // for view sepecefic moment based on moment id
    const { data: viewMoments } = useQuery({
      queryKey: ["moments", viewMoment],
      queryFn: () =>
        axios.get("/api/moment/" + viewMoment).then((res) => res.data),
      enabled: !!viewMoment
    })

  if (!id) return <div>المعرف غير موجود</div>;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="md:px-12 p-8">
      {/* Header */}
      <div className="mb-16 flex justify-between items-center">
        <p className="text-3xl font-bold">{group.name}</p>
      </div>

      {/* Moments Grid */}
      {group.moments.length > 0 ? (
        <Grid
          columns={{ initial: "1", md: "3", lg: "4" }}
          gap="6"
          className="w-full"
        >
          {group.moments.map((moment: any) => (
            <Card
              key={moment.id}
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-r-[#6200E8] hover:border-r-4 transition-transform transform hover:scale-105 "
            >
              <div className="flex justify-between items-start">
                <div className="text-xl font-bold line-clamp-1">
                  {moment.content}
                </div>
               <MomentCategory
                    category={moment.category}
                    date={moment.createdAt}
                  />
              </div>

              <div className="flex gap-4 mt-4">
                <TrashIcon
                  className="cursor-pointer w-5 h-5 text-red-600 hover:text-red-700 transition-transform transform hover:scale-110"
                  onClick={() => setSelectedMoment(moment.id)}
                />
                <EyeOpenIcon
                  onClick={() => setViewMoment(moment.id)}
                  className="cursor-pointer w-5 h-5 text-blue-600 hover:text-blue-700 transition-transform transform hover:scale-110"
                />
                <Link href={`/moments/${moment.id}/edit`}>
                  <Pencil2Icon className="cursor-pointer w-5 h-5 text-green-600 hover:text-green-700 transition-transform transform hover:scale-110" />
                </Link>
              </div>
            </Card>
          ))}
        </Grid>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">لا توجد لحظات مرتبطة بهذه المجموعة</p>
        </div>
      )}

      {/* Remove Moment Dialog */}
      <AlertDialog.Root
        open={!!selectedMoment}
        onOpenChange={() => setSelectedMoment(null)}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>حذف اللحظة</AlertDialog.Title>
          <AlertDialog.Description size="2" className="my-8">
            هل أنت متأكد من أنك تريد حذف هذه اللحظة؟ إنها جزء من رحلتك.
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
        <AlertDialog.Content>
          <AlertDialog.Title>{error && "حدث خطأ ما"}</AlertDialog.Title>
          <AlertDialog.Description>
            {error && "لا يمكن حذف هذه اللحظة"}
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="3"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>

            <AlertDialog.Root
              open={!!viewMoment}
              onOpenChange={() => setViewMoment(null)}
            >
              <AlertDialog.Content className="bg-white rounded-lg shadow-lg p-6">
                <AlertDialog.Title className="text-xl font-bold text-gray-800 mb-4 text-center">
                  لقد قمت بتوثيق هذه اللحظة في
                  <span className="mx-2 text-purple-600">
                    {dayjs(viewMoments?.createdAt).format("DD/MM/YYYY")}
                  </span>
                </AlertDialog.Title>
      
                <AlertDialog.Description className="text-gray-700 text-center mb-6">
                  {viewMoments?.content}
                </AlertDialog.Description>
      
                <div className="flex justify-center gap-4">
                  <AlertDialog.Cancel>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md cursor-pointer">
                      الرجوع
                    </button>
                  </AlertDialog.Cancel>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Root>
    </div>
  );
}
